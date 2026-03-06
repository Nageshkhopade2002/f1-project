# Production Deployment Fix - Bugfix Design

## Overview

The F1 Hub application fails to deploy to production due to three interconnected issues: (1) a module export/import mismatch causing Vite build failures, (2) hardcoded localhost URLs in 20+ frontend files preventing API communication, and (3) Railway's ephemeral filesystem causing 403 errors for media files. The fix strategy involves: correcting the API_BASE_URL export to support both import styles, systematically replacing all hardcoded URLs with the centralized configuration, and migrating media storage from the local filesystem to a persistent cloud storage solution (Cloudinary). This ensures the frontend can build successfully, communicate with the Railway backend, and display media files reliably in production.

## Glossary

- **Bug_Condition (C)**: The conditions that trigger deployment failures - Vite build errors, hardcoded localhost URLs, or ephemeral filesystem media access
- **Property (P)**: The desired behavior - successful builds, dynamic API URL resolution, and persistent media storage
- **Preservation**: Existing functionality that must remain unchanged - local development workflow, authentication, CORS, business logic
- **API_BASE_URL**: The centralized configuration variable in `f1-frontend/src/config/api.js` that determines the backend URL based on environment
- **Ephemeral Filesystem**: Railway's temporary storage that resets on each deployment, losing uploaded files
- **Cloudinary**: Cloud-based media management service that provides persistent storage with CDN delivery
- **VITE_API_BASE_URL**: Environment variable that overrides the default API base URL in production

## Bug Details

### Fault Condition

The deployment fails when the application is built and deployed to production environments (Vercel for frontend, Railway for backend). Three distinct fault conditions exist:

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type DeploymentContext
  OUTPUT: boolean
  
  RETURN (input.phase == "BUILD" AND exportStyleMismatch(input.configFile))
         OR (input.phase == "RUNTIME" AND hasHardcodedURL(input.sourceFile))
         OR (input.phase == "RUNTIME" AND isMediaRequest(input.request) AND usesEphemeralStorage(input.backend))
END FUNCTION

FUNCTION exportStyleMismatch(configFile)
  RETURN configFile.exports == "default" 
         AND configFile.imports CONTAINS "named"
END FUNCTION

FUNCTION hasHardcodedURL(sourceFile)
  RETURN sourceFile.content CONTAINS "http://localhost:8080"
END FUNCTION

FUNCTION isMediaRequest(request)
  RETURN request.path STARTS_WITH "/uploads/"
END FUNCTION

FUNCTION usesEphemeralStorage(backend)
  RETURN backend.platform == "Railway" 
         AND backend.storageType == "local_filesystem"
END FUNCTION
```

### Examples

**Bug 1: Build Failure**
- Input: Vercel attempts to build frontend with `import { API_BASE_URL } from './config/api.js'`
- Current: Build fails with error "API_BASE_URL is not exported by src/config/api.js"
- Expected: Build succeeds because api.js exports both default and named exports

**Bug 2: Hardcoded URL**
- Input: User visits TeamsPage in production at f1-project-virid.vercel.app
- Current: API request goes to `http://localhost:8080/api/teams` (fails with network error)
- Expected: API request goes to Railway backend URL via API_BASE_URL configuration

**Bug 3: Media 403 Error**
- Input: Browser requests `https://f1-backend.railway.app/uploads/news/image.jpg`
- Current: Returns 403 Forbidden because file doesn't exist on ephemeral filesystem
- Expected: Returns 200 OK with image from Cloudinary CDN

**Edge Cases:**
- Local development must continue using localhost:8080 without requiring environment variable changes
- External image URLs (starting with http/https) should not be migrated to Cloudinary
- Files in different upload subdirectories (drivers/, news/, tracks/, outlines/, teams/) must maintain their organization

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Local development environment must continue to use `http://localhost:8080/api` as the API base URL via the .env file
- Authenticated API requests must continue to include JWT tokens in the Authorization header
- CORS configuration must continue to accept requests from allowed origins (localhost:5173 and Vercel domain)
- Business logic for ticket booking, news viewing, team browsing, driver profiles, and race schedules must remain functionally identical
- Admin authentication and authorization via SecurityConfig.java must continue to work without modification
- The axios interceptor in services/api.js that attaches tokens must remain unchanged
- Database schema and entity relationships must remain unchanged

**Scope:**
All functionality that does NOT involve the API base URL configuration, media file storage location, or the specific 20+ files with hardcoded URLs should be completely unaffected by this fix. This includes:
- Authentication and authorization flows
- Database queries and data persistence
- Business logic in services and controllers
- React component rendering logic (except URL construction)
- Routing and navigation
- Form validation and error handling

## Hypothesized Root Cause

Based on the bug description and code analysis, the root causes are:

1. **Export/Import Mismatch**: The `f1-frontend/src/config/api.js` file uses `export default API_BASE_URL` but components import it as `import { API_BASE_URL }` (named import). Vite's ES module system strictly enforces this distinction, causing build failures in production even though it may work in development due to different module resolution.

2. **Incomplete Migration**: The codebase has a centralized API configuration (`api.js`) and a service layer (`services/api.js`) that correctly uses environment variables, but 20+ files were never migrated to use these abstractions. These files directly construct URLs with hardcoded `http://localhost:8080`, bypassing the configuration system entirely.

3. **Ephemeral Filesystem Misunderstanding**: The backend stores uploaded files in the local `uploads/` directory using Java NIO's `Paths.get("uploads")`. Railway's container-based deployment uses ephemeral storage that resets on each deployment, so any files uploaded after deployment are lost, and files committed to git are not reliably served due to Railway's filesystem behavior.

4. **Missing Environment Variable Configuration**: The Vercel deployment likely doesn't have `VITE_API_BASE_URL` configured, so even if the import issue were fixed, the frontend would still default to localhost.

## Correctness Properties

Property 1: Fault Condition - Successful Production Build

_For any_ deployment context where the frontend build process runs on Vercel, the build SHALL complete successfully without module resolution errors, correctly resolving both default and named imports of API_BASE_URL from the configuration file.

**Validates: Requirements 2.1**

Property 2: Fault Condition - Dynamic API URL Resolution

_For any_ API request made from the frontend in production, the request SHALL use the centralized API_BASE_URL configuration (reading from VITE_API_BASE_URL environment variable) to construct the correct Railway backend URL, not hardcoded localhost URLs.

**Validates: Requirements 2.2, 2.4**

Property 3: Fault Condition - Persistent Media Access

_For any_ media file request (images, videos) made from the frontend in production, the backend SHALL serve the file from persistent cloud storage (Cloudinary), returning 200 OK with the file content, not 403 Forbidden errors from ephemeral filesystem.

**Validates: Requirements 2.3**

Property 4: Preservation - Local Development Workflow

_For any_ development context where the application runs locally (localhost:5173 frontend, localhost:8080 backend), the application SHALL continue to function exactly as before, using localhost URLs without requiring environment variable configuration changes.

**Validates: Requirements 3.1**

Property 5: Preservation - Authentication and Business Logic

_For any_ user interaction (authenticated API requests, ticket booking, news viewing, admin operations), the application SHALL preserve all existing authentication, authorization, and business logic behavior, with only the URL construction mechanism changed.

**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `f1-frontend/src/config/api.js`

**Function**: Module exports

**Specific Changes**:
1. **Add Named Export**: Change from `export default API_BASE_URL` to support both export styles
   - Add `export { API_BASE_URL }` to support named imports
   - Keep `export default API_BASE_URL` to support default imports
   - This allows both `import API_BASE_URL from './config/api'` and `import { API_BASE_URL } from './config/api'` to work

**File 2**: `f1-frontend/src/pages/user/TicketList.jsx`

**Function**: `fetchTickets`, `fetchRaces`

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace Hardcoded URLs**: Change `'http://localhost:8080/api/tickets'` to `` `${API_BASE_URL}/api/tickets` ``
3. **Replace Hardcoded URLs**: Change `'http://localhost:8080/api/schedule/2026'` to `` `${API_BASE_URL}/api/schedule/2026` ``

**File 3**: `f1-frontend/src/pages/user/TeamsPage.jsx`

**Function**: Component-level constant

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace BASE_URL Constant**: Change `const BASE_URL = "http://localhost:8080/"` to `const BASE_URL = API_BASE_URL`

**File 4**: `f1-frontend/src/pages/user/TeamDetails.jsx`

**Function**: Component-level constant

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace BASE_URL Constant**: Change `const BASE_URL = "http://localhost:8080/"` to `const BASE_URL = API_BASE_URL`

**File 5**: `f1-frontend/src/pages/user/Schedule2026.jsx`

**Function**: Image URL construction in JSX

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace Inline URLs**: Change all instances of `` `http://localhost:8080${path}` `` to `` `${API_BASE_URL}${path}` ``
3. **Count**: 4 replacements (2 trackOutline, 2 trackImage in backgroundImage styles)

**File 6**: `f1-frontend/src/pages/user/RaceDetails.jsx`

**Function**: `trackImage` and `trackOutline` variable assignments

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URLs**: Change `` `http://localhost:8080${data.circuit.trackImage}` `` to `` `${API_BASE_URL}${data.circuit.trackImage}` ``
3. **Replace URLs**: Change `` `http://localhost:8080${data.circuit.trackOutline}` `` to `` `${API_BASE_URL}${data.circuit.trackOutline}` ``

**File 7**: `f1-frontend/src/pages/user/NewsPage.jsx`

**Function**: Image src attributes in JSX

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URLs**: Change all instances of `` `http://localhost:8080${article.imageUrl}` `` to `` `${API_BASE_URL}${article.imageUrl}` ``
3. **Count**: 2 replacements (featured news and news grid)

**File 8**: `f1-frontend/src/pages/user/NewsDetails.jsx`

**Function**: Image src attribute in JSX

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URL**: Change `` `http://localhost:8080${article.imageUrl}` `` to `` `${API_BASE_URL}${article.imageUrl}` ``

**File 9**: `f1-frontend/src/pages/user/DriversPage.jsx`

**Function**: Component-level constants

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace API Constant**: Change `const API = "http://localhost:8080/api/drivers"` to `` const API = `${API_BASE_URL}/api/drivers` ``
3. **Replace BASE_URL Constant**: Change `const BASE_URL = "http://localhost:8080/"` to `const BASE_URL = API_BASE_URL`

**File 10**: `f1-frontend/src/pages/user/DriverProfile.jsx`

**Function**: Component-level constant

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace BASE_URL Constant**: Change `const BASE_URL = "http://localhost:8080/"` to `const BASE_URL = API_BASE_URL`

**File 11**: `f1-frontend/src/pages/admin/ManageDrivers.jsx`

**Function**: Image URL construction in edit handler and render

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URLs**: Change all instances of `` `http://localhost:8080${path}` `` and `` `http://localhost:8080/${path}` `` to `` `${API_BASE_URL}${path}` `` (normalize to remove double slashes)
3. **Count**: 4 replacements (2 in edit handler, 2 in render)

**File 12**: `f1-frontend/src/pages/admin/ManageNews.jsx`

**Function**: Image src in render

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URL**: Change `` `http://localhost:8080${row.imageUrl}` `` to `` `${API_BASE_URL}${row.imageUrl}` ``

**File 13**: `f1-frontend/src/pages/admin/ManageCircuits.jsx`

**Function**: Image src in render for track images and outlines

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace Conditional URL**: Change `row.trackImage.startsWith("http") ? row.trackImage : \`http://localhost:8080${row.trackImage}\`` to `row.trackImage.startsWith("http") ? row.trackImage : \`${API_BASE_URL}${row.trackImage}\``
3. **Replace URL**: Change `` `http://localhost:8080${row.trackOutline}` `` to `` `${API_BASE_URL}${row.trackOutline}` ``

**File 14**: `f1-frontend/src/components/tickets/TicketList_old.jsx`

**Function**: `fetchTickets`, `fetchRaces`

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URLs**: Same as TicketList.jsx (2 replacements)

**File 15**: `f1-frontend/src/components/tickets/admin/AdminTickets.jsx`

**Function**: `fetchTickets`, `fetchRaces`, `handleSubmit`, `handleDelete`

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../../config/api'` at the top
2. **Replace URLs**: Change all 5 instances of `'http://localhost:8080/api/...'` to `` `${API_BASE_URL}/api/...` ``

**File 16**: `f1-frontend/src/components/tickets/TicketList.jsx`

**Function**: `fetchTickets`, `fetchRaces`

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URLs**: Change 2 instances to use API_BASE_URL

**File 17**: `f1-frontend/src/components/tickets/MyBookings.jsx`

**Function**: `fetchBookings`, `handleCancelBooking`

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URLs**: Change 2 instances to use API_BASE_URL

**File 18**: `f1-frontend/src/components/tickets/BookTicket.jsx`

**Function**: `fetchTicketDetails`, `handleBooking`, `verifyPayment`

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URLs**: Change 4 instances to use API_BASE_URL

**File 19**: `f1-frontend/src/components/news/NewsWidget.jsx`

**Function**: Image src in JSX

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URL**: Change `` `http://localhost:8080${n.imageUrl}` `` to `` `${API_BASE_URL}${n.imageUrl}` ``

**File 20**: `f1-frontend/src/components/layout/NextEvent.jsx`

**Function**: Image URL construction

**Specific Changes**:
1. **Import API_BASE_URL**: Add `import { API_BASE_URL } from '../../config/api'` at the top
2. **Replace URL**: Change `` `http://localhost:8080${race.circuit.circuitImage}` `` to `` `${API_BASE_URL}${race.circuit.circuitImage}` ``

**Backend Changes for Media Storage**:

**File 21**: `f1-backend/pom.xml`

**Function**: Maven dependencies

**Specific Changes**:
1. **Add Cloudinary Dependency**: Add the following dependency block:
```xml
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

**File 22**: `f1-backend/src/main/resources/application.properties`

**Function**: Application configuration

**Specific Changes**:
1. **Add Cloudinary Configuration**: Add environment variable placeholders:
```properties
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}
```

**File 23**: `f1-backend/src/main/java/com/f1hub/config/CloudinaryConfig.java` (NEW FILE)

**Function**: Cloudinary bean configuration

**Specific Changes**:
1. **Create Configuration Class**: Create a new Spring configuration class that initializes Cloudinary with credentials from environment variables
2. **Expose Cloudinary Bean**: Make Cloudinary instance available for dependency injection

**File 24**: `f1-backend/src/main/java/com/f1hub/service/CloudinaryService.java` (NEW FILE)

**Function**: Media upload abstraction

**Specific Changes**:
1. **Create Upload Method**: Implement `uploadFile(MultipartFile file, String folder)` that uploads to Cloudinary and returns the public URL
2. **Create Delete Method**: Implement `deleteFile(String publicId)` for cleanup
3. **Handle Errors**: Wrap Cloudinary exceptions in RuntimeException with meaningful messages

**File 25**: `f1-backend/src/main/java/com/f1hub/service/NewsService.java`

**Function**: `handleImage` method

**Specific Changes**:
1. **Inject CloudinaryService**: Add CloudinaryService dependency via constructor
2. **Replace File Upload Logic**: Instead of `Files.copy()` to local filesystem, call `cloudinaryService.uploadFile(image, "news")`
3. **Store Cloudinary URL**: Save the returned Cloudinary URL (e.g., `https://res.cloudinary.com/.../image.jpg`) in `news.setImageUrl()`
4. **Remove Directory Creation**: Remove `Files.createDirectories(IMAGE_DIR)` as it's no longer needed
5. **Keep External URL Logic**: Preserve the `else if (imageUrl != null)` branch for external URLs

**File 26**: `f1-backend/src/main/java/com/f1hub/controller/CircuitController.java`

**Function**: `addCircuit` and `updateCircuit` methods

**Specific Changes**:
1. **Inject CloudinaryService**: Add CloudinaryService dependency
2. **Replace Track Image Upload**: Change `trackImage.transferTo(dest)` to `cloudinaryService.uploadFile(trackImage, "tracks")`
3. **Replace Track Outline Upload**: Change `trackOutline.transferTo(dest)` to `cloudinaryService.uploadFile(trackOutline, "outlines")`
4. **Store Cloudinary URLs**: Save returned URLs in `c.setTrackImage()` and `c.setTrackOutline()`
5. **Remove File System Logic**: Remove `BASE_DIR` constant and file path construction

**File 27**: `f1-backend/src/main/java/com/f1hub/controller/AdminTeamController.java`

**Function**: Team logo upload

**Specific Changes**:
1. **Inject CloudinaryService**: Add CloudinaryService dependency
2. **Replace Upload Logic**: Change file system upload to `cloudinaryService.uploadFile(logoFile, "teams")`
3. **Store Cloudinary URL**: Save returned URL in team entity
4. **Remove uploadDir**: Remove `private final String uploadDir = "uploads/teams/"`

**File 28**: `f1-backend/src/main/java/com/f1hub/controller/AdminDriverController.java`

**Function**: Driver profile image upload

**Specific Changes**:
1. **Inject CloudinaryService**: Add CloudinaryService dependency
2. **Replace Upload Logic**: Change file system upload to `cloudinaryService.uploadFile(profileImage, "drivers")`
3. **Store Cloudinary URL**: Save returned URL in driver entity
4. **Remove uploadDir**: Remove `private final String uploadDir = "uploads/drivers/"`

**File 29**: `f1-backend/src/main/java/com/f1hub/config/WebConfig.java`

**Function**: Resource handler configuration

**Specific Changes**:
1. **Remove Resource Handler**: Remove or comment out the `addResourceHandlers` method since files are now served from Cloudinary CDN, not local filesystem
2. **Keep CORS Configuration**: Preserve the `addCorsMappings` method unchanged

**Environment Configuration**:

**Vercel Environment Variables** (configured in Vercel dashboard):
- `VITE_API_BASE_URL`: Set to Railway backend URL (e.g., `https://f1-backend-production.up.railway.app`)

**Railway Environment Variables** (configured in Railway dashboard):
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

**Local Development** (no changes required):
- `f1-frontend/.env`: Keep `VITE_API_BASE_URL=http://localhost:8080` (or omit, as this is the default)
- Backend: No Cloudinary variables needed if using local filesystem for development (add conditional logic in CloudinaryService)

## Testing Strategy

### Validation Approach

The testing strategy follows a three-phase approach: first, surface counterexamples that demonstrate each bug on unfixed code; second, verify each fix works correctly in isolation; third, verify the complete integration works end-to-end in production. This ensures we understand the root causes, validate individual fixes, and confirm no regressions.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Run tests on the UNFIXED code to observe failures and understand the root causes.

**Test Cases**:
1. **Build Failure Test**: Attempt to build the frontend with `npm run build` on unfixed code (will fail with "API_BASE_URL is not exported")
   - Verify the error message matches the expected module resolution error
   - Confirm the issue is in `src/config/api.js` export style
   
2. **Hardcoded URL Test**: Deploy unfixed frontend to Vercel and attempt to load TeamsPage (will fail with network error)
   - Open browser DevTools Network tab
   - Observe requests going to `http://localhost:8080/api/teams` instead of Railway URL
   - Confirm 20+ files contain hardcoded localhost URLs via grep search
   
3. **Media 403 Test**: Deploy unfixed backend to Railway and request an image URL (will return 403 Forbidden)
   - Upload an image via admin panel
   - Attempt to access the image URL in browser
   - Observe 403 error because file doesn't exist on ephemeral filesystem
   - Redeploy Railway and confirm uploaded file is lost

4. **Import Style Test**: Create a test file that imports API_BASE_URL as named import (will fail on unfixed code)
   - Create `test-import.js` with `import { API_BASE_URL } from './config/api'`
   - Run Vite build and observe failure

**Expected Counterexamples**:
- Vite build fails with module resolution error for named imports
- Network requests in production go to localhost instead of Railway backend
- Media files return 403 after Railway redeployment
- Possible causes: export/import mismatch, incomplete migration to centralized config, ephemeral filesystem

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces the expected behavior.

**Pseudocode:**
```
FOR ALL deploymentContext WHERE isBugCondition(deploymentContext) DO
  result := deployToProduction_fixed(deploymentContext)
  ASSERT expectedBehavior(result)
END FOR

FUNCTION expectedBehavior(result)
  RETURN result.buildStatus == "SUCCESS"
         AND result.apiRequests ALL use dynamicURL
         AND result.mediaRequests ALL return 200
END FUNCTION
```

**Test Cases**:
1. **Build Success Test**: Build frontend with fixed api.js and verify success
   - Run `npm run build` on fixed code
   - Assert build completes without errors
   - Verify both `import API_BASE_URL from './config/api'` and `import { API_BASE_URL } from './config/api'` work

2. **Dynamic URL Test**: Deploy fixed frontend to Vercel with VITE_API_BASE_URL set to Railway URL
   - Load TeamsPage in production
   - Open DevTools Network tab
   - Assert all API requests go to Railway backend URL, not localhost
   - Test all 20+ affected pages

3. **Cloudinary Media Test**: Deploy fixed backend with Cloudinary configuration
   - Upload an image via admin panel
   - Verify image URL is a Cloudinary URL (starts with `https://res.cloudinary.com/`)
   - Access image in browser and assert 200 OK response
   - Redeploy Railway and confirm image is still accessible

4. **Environment Variable Test**: Verify VITE_API_BASE_URL is correctly read in production
   - Set environment variable in Vercel dashboard
   - Deploy and check that `import.meta.env.VITE_API_BASE_URL` resolves to Railway URL
   - Test with missing environment variable and verify fallback to localhost (for local dev)

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL context WHERE NOT isBugCondition(context) DO
  ASSERT originalBehavior(context) = fixedBehavior(context)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for local development and business logic, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Local Development Preservation**: Verify local development workflow continues to work
   - Run frontend and backend locally on unfixed code, document behavior
   - Run on fixed code with no environment variables set
   - Assert API requests still go to `http://localhost:8080/api`
   - Assert all features work identically (ticket booking, news, teams, drivers)

2. **Authentication Preservation**: Verify JWT token handling is unchanged
   - Test login flow on unfixed code, capture token in localStorage
   - Test on fixed code and verify token is stored identically
   - Test authenticated requests and verify Authorization header is attached
   - Test admin-only endpoints and verify authorization works

3. **CORS Preservation**: Verify CORS configuration is unchanged
   - Test cross-origin requests from localhost:5173 on unfixed code
   - Test on fixed code and verify same origins are allowed
   - Test that Vercel domain is still in allowed origins

4. **Business Logic Preservation**: Verify all features work identically
   - Test ticket booking flow end-to-end on unfixed code
   - Test on fixed code and verify same database records are created
   - Test news CRUD operations and verify same behavior
   - Test team/driver browsing and verify same data is displayed

5. **External URL Preservation**: Verify external image URLs are not migrated to Cloudinary
   - Create news article with external image URL (e.g., `https://example.com/image.jpg`) on unfixed code
   - Create on fixed code and verify URL is stored as-is, not uploaded to Cloudinary
   - Verify conditional logic in `handleImage` preserves external URLs

### Unit Tests

- Test `api.js` exports both default and named exports correctly
- Test API_BASE_URL resolves to environment variable when set, defaults to localhost when not set
- Test CloudinaryService.uploadFile() returns valid Cloudinary URL
- Test CloudinaryService handles upload errors gracefully
- Test NewsService.handleImage() uploads to Cloudinary for file uploads
- Test NewsService.handleImage() preserves external URLs
- Test each affected frontend component constructs URLs using API_BASE_URL
- Test that local development uses localhost without environment variables

### Property-Based Tests

- Generate random API endpoints and verify all use API_BASE_URL in production
- Generate random media file uploads and verify all return Cloudinary URLs
- Generate random user interactions and verify authentication is preserved
- Generate random deployment contexts (local vs production) and verify correct URL resolution
- Generate random image types (uploaded vs external) and verify correct handling

### Integration Tests

- Test full deployment pipeline: build frontend, deploy to Vercel, verify API communication
- Test full media upload flow: upload via admin panel, verify Cloudinary storage, verify frontend display
- Test environment variable propagation: set in Vercel/Railway, verify application reads correctly
- Test cross-origin requests from Vercel to Railway backend
- Test that redeploying Railway doesn't lose media files (Cloudinary persistence)
- Test local development workflow end-to-end with no environment variables
- Test production workflow end-to-end with environment variables set
