# Implementation Plan

- [-] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Production Deployment Failures
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the three deployment bugs exist
  - **Scoped PBT Approach**: Test the three concrete failing cases: build failure, hardcoded URL requests, and media 403 errors
  - Test 1.1: Attempt to build frontend with `npm run build` - expect build failure with "API_BASE_URL is not exported by src/config/api.js"
  - Test 1.2: Search codebase for hardcoded localhost URLs using grep - expect to find 20+ files with `http://localhost:8080`
  - Test 1.3: Verify media files return 403 by checking that uploads directory uses local filesystem (Railway ephemeral storage)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bugs exist)
  - Document counterexamples found:
    - Build error message and location
    - List of files with hardcoded URLs
    - Evidence of ephemeral filesystem usage
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3_

- [~] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Local Development and Business Logic
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (local development environment)
  - Test 2.1: Verify local development uses `http://localhost:8080/api` without environment variables
  - Test 2.2: Verify authenticated API requests include JWT tokens in Authorization header
  - Test 2.3: Verify CORS configuration accepts requests from localhost:5173
  - Test 2.4: Verify business logic (ticket booking, news viewing, team browsing) functions correctly
  - Test 2.5: Verify admin authentication and authorization works via SecurityConfig.java
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Fix production deployment issues

  - [~] 3.1 Fix API_BASE_URL export/import mismatch
    - Open `f1-frontend/src/config/api.js`
    - Add named export: `export { API_BASE_URL }`
    - Keep existing default export: `export default API_BASE_URL`
    - This allows both `import API_BASE_URL from './config/api'` and `import { API_BASE_URL } from './config/api'` to work
    - _Bug_Condition: isBugCondition(input) where input.phase == "BUILD" AND exportStyleMismatch(input.configFile)_
    - _Expected_Behavior: Build succeeds with both import styles supported_
    - _Preservation: Local development workflow unchanged_
    - _Requirements: 2.1_

  - [~] 3.2 Replace hardcoded localhost URLs in frontend files (20+ files)
    - Import API_BASE_URL in each affected file
    - Replace all `http://localhost:8080` with `${API_BASE_URL}`
    - Files to update:
      - `f1-frontend/src/pages/user/TicketList.jsx` (2 URLs)
      - `f1-frontend/src/pages/user/TeamsPage.jsx` (BASE_URL constant)
      - `f1-frontend/src/pages/user/TeamDetails.jsx` (BASE_URL constant)
      - `f1-frontend/src/pages/user/Schedule2026.jsx` (4 URLs in backgroundImage)
      - `f1-frontend/src/pages/user/RaceDetails.jsx` (2 URLs: trackImage, trackOutline)
      - `f1-frontend/src/pages/user/NewsPage.jsx` (2 URLs)
      - `f1-frontend/src/pages/user/NewsDetails.jsx` (1 URL)
      - `f1-frontend/src/pages/user/DriversPage.jsx` (API and BASE_URL constants)
      - `f1-frontend/src/pages/user/DriverProfile.jsx` (BASE_URL constant)
      - `f1-frontend/src/pages/admin/ManageDrivers.jsx` (4 URLs)
      - `f1-frontend/src/pages/admin/ManageNews.jsx` (1 URL)
      - `f1-frontend/src/pages/admin/ManageCircuits.jsx` (2 URLs with conditional)
      - `f1-frontend/src/components/tickets/TicketList_old.jsx` (2 URLs)
      - `f1-frontend/src/components/tickets/admin/AdminTickets.jsx` (5 URLs)
      - `f1-frontend/src/components/tickets/TicketList.jsx` (2 URLs)
      - `f1-frontend/src/components/tickets/MyBookings.jsx` (2 URLs)
      - `f1-frontend/src/components/tickets/BookTicket.jsx` (4 URLs)
      - `f1-frontend/src/components/news/NewsWidget.jsx` (1 URL)
      - `f1-frontend/src/components/layout/NextEvent.jsx` (1 URL)
    - _Bug_Condition: isBugCondition(input) where input.phase == "RUNTIME" AND hasHardcodedURL(input.sourceFile)_
    - _Expected_Behavior: All API requests use centralized API_BASE_URL configuration_
    - _Preservation: Local development continues to use localhost:8080 via .env_
    - _Requirements: 2.2, 2.4_

  - [~] 3.3 Implement Cloudinary integration for persistent media storage
    - Add Cloudinary dependency to `f1-backend/pom.xml`:
      ```xml
      <dependency>
          <groupId>com.cloudinary</groupId>
          <artifactId>cloudinary-http44</artifactId>
          <version>1.36.0</version>
      </dependency>
      ```
    - Add Cloudinary configuration to `f1-backend/src/main/resources/application.properties`:
      ```properties
      cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
      cloudinary.api-key=${CLOUDINARY_API_KEY}
      cloudinary.api-secret=${CLOUDINARY_API_SECRET}
      ```
    - Create `f1-backend/src/main/java/com/f1hub/config/CloudinaryConfig.java`:
      - Initialize Cloudinary bean with credentials from environment variables
      - Expose Cloudinary instance for dependency injection
    - Create `f1-backend/src/main/java/com/f1hub/service/CloudinaryService.java`:
      - Implement `uploadFile(MultipartFile file, String folder)` method
      - Implement `deleteFile(String publicId)` method
      - Handle Cloudinary exceptions with meaningful error messages
    - Update `f1-backend/src/main/java/com/f1hub/service/NewsService.java`:
      - Inject CloudinaryService dependency
      - Replace `Files.copy()` with `cloudinaryService.uploadFile(image, "news")`
      - Store Cloudinary URL in `news.setImageUrl()`
      - Remove directory creation logic
      - Preserve external URL handling
    - Update `f1-backend/src/main/java/com/f1hub/controller/CircuitController.java`:
      - Inject CloudinaryService dependency
      - Replace `trackImage.transferTo(dest)` with `cloudinaryService.uploadFile(trackImage, "tracks")`
      - Replace `trackOutline.transferTo(dest)` with `cloudinaryService.uploadFile(trackOutline, "outlines")`
      - Store Cloudinary URLs in circuit entity
      - Remove file system logic
    - Update `f1-backend/src/main/java/com/f1hub/controller/AdminTeamController.java`:
      - Inject CloudinaryService dependency
      - Replace file system upload with `cloudinaryService.uploadFile(logoFile, "teams")`
      - Store Cloudinary URL in team entity
      - Remove uploadDir constant
    - Update `f1-backend/src/main/java/com/f1hub/controller/AdminDriverController.java`:
      - Inject CloudinaryService dependency
      - Replace file system upload with `cloudinaryService.uploadFile(profileImage, "drivers")`
      - Store Cloudinary URL in driver entity
      - Remove uploadDir constant
    - Update `f1-backend/src/main/java/com/f1hub/config/WebConfig.java`:
      - Remove or comment out `addResourceHandlers` method (files now served from Cloudinary CDN)
      - Keep CORS configuration unchanged
    - _Bug_Condition: isBugCondition(input) where input.phase == "RUNTIME" AND isMediaRequest(input.request) AND usesEphemeralStorage(input.backend)_
    - _Expected_Behavior: Media files served from persistent Cloudinary storage, returning 200 OK_
    - _Preservation: External image URLs not migrated to Cloudinary, business logic unchanged_
    - _Requirements: 2.3_

  - [~] 3.4 Configure environment variables in Vercel and Railway
    - Vercel Dashboard:
      - Navigate to project settings > Environment Variables
      - Add `VITE_API_BASE_URL` = Railway backend URL (e.g., `https://f1-backend-production.up.railway.app`)
      - Apply to Production environment
      - Redeploy frontend to apply changes
    - Railway Dashboard:
      - Navigate to project settings > Variables
      - Add `CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name
      - Add `CLOUDINARY_API_KEY` = your Cloudinary API key
      - Add `CLOUDINARY_API_SECRET` = your Cloudinary API secret
      - Redeploy backend to apply changes
    - Verify environment variables are correctly set in both platforms
    - _Bug_Condition: Missing environment variables prevent dynamic URL resolution and Cloudinary integration_
    - _Expected_Behavior: Environment variables correctly propagate to application runtime_
    - _Preservation: Local development requires no environment variable changes_
    - _Requirements: 2.1, 2.2, 2.3_

  - [~] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Successful Production Deployment
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Test 1.1: Run `npm run build` - expect SUCCESS (no module resolution errors)
    - Test 1.2: Search codebase for hardcoded localhost URLs - expect 0 results in affected files (all replaced with API_BASE_URL)
    - Test 1.3: Deploy to Railway and verify media files use Cloudinary URLs (start with `https://res.cloudinary.com/`)
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [~] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Local Development and Business Logic
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Test 2.1: Verify local development still uses `http://localhost:8080/api`
    - Test 2.2: Verify authenticated requests still include JWT tokens
    - Test 2.3: Verify CORS still accepts localhost:5173
    - Test 2.4: Verify business logic still functions correctly
    - Test 2.5: Verify admin authentication still works
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Integration testing and deployment

  - [~] 4.1 Test frontend build locally
    - Run `npm run build` in f1-frontend directory
    - Verify build completes successfully
    - Check that both import styles work (default and named)
    - Verify no module resolution errors

  - [~] 4.2 Test local development environment
    - Start backend: `./mvnw spring-boot:run` in f1-backend
    - Start frontend: `npm run dev` in f1-frontend
    - Verify application uses `http://localhost:8080/api`
    - Test ticket booking, news viewing, team browsing
    - Verify all features work without environment variables

  - [~] 4.3 Deploy and test production environment
    - Commit all changes to git
    - Push to main branch to trigger deployments
    - Wait for Vercel and Railway deployments to complete
    - Open production frontend URL
    - Open browser DevTools Network tab
    - Verify all API requests go to Railway backend URL (not localhost)
    - Test all 20+ affected pages (teams, drivers, news, schedule, tickets)
    - Verify all pages load correctly and API communication works

  - [~] 4.4 Test media upload and persistence
    - Log in to admin panel in production
    - Upload a news article with an image
    - Verify image URL is a Cloudinary URL (starts with `https://res.cloudinary.com/`)
    - View the news article and verify image displays correctly
    - Upload a driver profile image
    - Upload a circuit track image and outline
    - Verify all media files use Cloudinary URLs
    - Trigger a Railway redeployment
    - Verify all uploaded media files are still accessible (not lost)

  - [~] 4.5 Test external URL preservation
    - Create a news article with an external image URL (e.g., `https://example.com/image.jpg`)
    - Verify the URL is stored as-is (not uploaded to Cloudinary)
    - View the article and verify external image displays correctly

  - [~] 4.6 Test authentication and authorization
    - Test user login flow in production
    - Verify JWT token is stored in localStorage
    - Make authenticated API requests
    - Verify Authorization header is attached
    - Test admin-only endpoints
    - Verify admin authorization works correctly

- [~] 5. Checkpoint - Ensure all tests pass
  - Verify all exploration tests pass (build succeeds, no hardcoded URLs, media from Cloudinary)
  - Verify all preservation tests pass (local dev works, auth works, business logic unchanged)
  - Verify integration tests pass (production deployment works end-to-end)
  - Confirm no regressions in existing functionality
  - Ask the user if questions arise
