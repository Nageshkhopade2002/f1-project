# Full-Stack Deployment Guide
## Spring Boot + React + MySQL Production Deployment

---

## 📋 Pre-Deployment Checklist

- [ ] Backend code tested locally
- [ ] Frontend code tested locally
- [ ] Database schema finalized
- [ ] JWT authentication working locally
- [ ] API endpoints documented
- [ ] Environment variables identified

---

## 🗄️ STEP 1: Deploy MySQL Database

### Option A: Railway (Recommended - Free Tier)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Provision MySQL"
4. Copy credentials:
   ```
   MYSQL_HOST=containers-us-west-xxx.railway.app
   MYSQL_PORT=6379
   MYSQL_DATABASE=railway
   MYSQL_USER=root
   MYSQL_PASSWORD=xxxxx
   MYSQL_URL=mysql://root:xxxxx@containers-us-west-xxx.railway.app:6379/railway
   ```

### Option B: AWS RDS
1. Go to AWS Console → RDS
2. Create Database → MySQL
3. Choose Free Tier (db.t3.micro)
4. Set DB name, username, password
5. Enable Public Access
6. Security Group: Allow port 3306 from anywhere (0.0.0.0/0)

### Option C: PlanetScale (Free Tier)
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string

---

## 🚀 STEP 2: Configure Spring Boot for Production

### 2.1 Update `application.properties`

Create `src/main/resources/application-prod.properties`:

```properties
# Server Configuration
server.port=${PORT:8080}

# Database Configuration
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=false

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# CORS Configuration (Will be handled in code)
allowed.origins=${FRONTEND_URL}

# Logging
logging.level.root=INFO
logging.level.com.yourpackage=INFO
```

### 2.2 Update CORS Configuration

Create/Update `WebConfig.java`:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${allowed.origins}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 2.3 Update Security Configuration

In `SecurityConfig.java`, add CORS:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        // ... rest of your config
    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 2.4 Build Spring Boot Application

```bash
# Navigate to backend directory
cd backend

# Clean and build (skip tests for faster build)
./mvnw clean package -DskipTests

# Or with Gradle
./gradlew clean build -x test

# JAR file will be in target/ or build/libs/
```

---

## ☁️ STEP 3: Deploy Spring Boot Backend

### Option A: Render (Recommended - Free Tier)

1. **Push code to GitHub** (if not already)

2. **Go to [render.com](https://render.com)**
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository

3. **Configure Service:**
   ```
   Name: f1-backend
   Environment: Java
   Build Command: ./mvnw clean package -DskipTests
   Start Command: java -jar target/your-app-name.jar
   ```

4. **Add Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:mysql://your-railway-host:6379/railway
   DB_USERNAME=root
   DB_PASSWORD=your-password
   JWT_SECRET=your-super-secret-key-min-256-bits
   FRONTEND_URL=https://your-app.netlify.app
   PORT=8080
   ```

5. **Deploy** - Wait 5-10 minutes

6. **Your Backend URL:** `https://f1-backend.onrender.com`

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your backend repo
4. Add environment variables (same as above)
5. Railway auto-detects Java and deploys

### Option C: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p java-17 f1-backend

# Create environment
eb create f1-backend-env

# Set environment variables
eb setenv SPRING_PROFILES_ACTIVE=prod DATABASE_URL=xxx DB_USERNAME=xxx DB_PASSWORD=xxx JWT_SECRET=xxx FRONTEND_URL=xxx

# Deploy
eb deploy
```

---

## ⚛️ STEP 4: Configure React Frontend

### 4.1 Create Environment Configuration

Create `.env.production`:

```env
VITE_API_BASE_URL=https://f1-backend.onrender.com/api
```

### 4.2 Update API Configuration

Create/Update `src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default API_BASE_URL;
```

### 4.3 Update API Service

In your API service file (e.g., `src/services/api.js`):

```javascript
import axios from 'axios';
import API_BASE_URL from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4.4 Build React Application

```bash
# Navigate to frontend directory
cd f1-frontend

# Install dependencies
npm install

# Build for production
npm run build

# dist/ folder will contain production build
```

---

## 🌐 STEP 5: Deploy React Frontend

### Option A: Netlify (Recommended)

1. **Go to [netlify.com](https://netlify.com)**
   - Sign up with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your frontend repo

2. **Configure Build Settings:**
   ```
   Base directory: (leave empty or f1-frontend if monorepo)
   Build command: npm run build
   Publish directory: dist
   ```

3. **Add Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://f1-backend.onrender.com/api`

4. **Deploy** - Takes 1-2 minutes

5. **Custom Domain (Optional):**
   - Site Settings → Domain Management
   - Add custom domain

6. **Your Frontend URL:** `https://your-app.netlify.app`

### Option B: Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. Import Git Repository
3. Configure:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```
4. Add Environment Variable: `VITE_API_BASE_URL`
5. Deploy

### Option C: AWS S3 + CloudFront

```bash
# Build
npm run build

# Install AWS CLI
# Configure: aws configure

# Create S3 bucket
aws s3 mb s3://f1-frontend

# Upload build
aws s3 sync dist/ s3://f1-frontend --delete

# Enable static website hosting
aws s3 website s3://f1-frontend --index-document index.html --error-document index.html

# Set bucket policy for public access
```

---

## 🔄 STEP 6: Update Backend CORS with Frontend URL

After deploying frontend, update backend environment variable:

**On Render/Railway:**
```
FRONTEND_URL=https://your-app.netlify.app,https://your-app.vercel.app
```

**Redeploy backend** or it will auto-redeploy on Render.

---

## ✅ STEP 7: Testing & Verification

### 7.1 Test Backend API

```bash
# Health check
curl https://f1-backend.onrender.com/actuator/health

# Test public endpoint
curl https://f1-backend.onrender.com/api/public/test

# Test register
curl -X POST https://f1-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"Test123!"}'

# Test login
curl -X POST https://f1-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'
```

### 7.2 Test Frontend

1. Open `https://your-app.netlify.app`
2. Open Browser DevTools → Network tab
3. Try to register a new user
4. Check if API call goes to correct backend URL
5. Try to login
6. Check if token is stored in localStorage
7. Navigate to protected routes
8. Check if Authorization header is sent

### 7.3 Verification Checklist

- [ ] Frontend loads without errors
- [ ] API calls reach backend (check Network tab)
- [ ] Register creates user in database
- [ ] Login returns JWT token
- [ ] Token stored in localStorage
- [ ] Protected routes require authentication
- [ ] 401 redirects to login
- [ ] Admin routes only accessible by admin
- [ ] User routes only accessible by user
- [ ] CORS errors resolved
- [ ] No console errors

---

## 🐛 Common Errors & Fixes

### Error 1: CORS Policy Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
- Add frontend URL to `FRONTEND_URL` env variable in backend
- Ensure CORS configuration includes credentials
- Redeploy backend

### Error 2: 401 Unauthorized
```
Request failed with status code 401
```

**Fix:**
- Check if token is being sent in Authorization header
- Verify JWT secret is same in production
- Check token expiration
- Ensure interceptor adds `Bearer ` prefix

### Error 3: Database Connection Failed
```
Communications link failure
```

**Fix:**
- Verify DATABASE_URL format: `jdbc:mysql://host:port/database`
- Check database credentials
- Ensure database allows external connections
- Check if database service is running

### Error 4: 404 on React Routes (Refresh)
```
Page not found when refreshing React app
```

**Fix Netlify:**
Create `public/_redirects`:
```
/*    /index.html   200
```

**Fix Vercel:**
Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Error 5: Environment Variables Not Working

**Fix:**
- Vite requires `VITE_` prefix
- Rebuild after adding env variables
- Check if env variables are set in hosting platform
- Restart/redeploy after changes

### Error 6: Backend Takes Long to Start (Render Free Tier)

**Issue:** Render free tier spins down after inactivity

**Fix:**
- First request takes 30-60 seconds
- Use a cron job to ping every 14 minutes
- Upgrade to paid tier for always-on

### Error 7: JWT Token Invalid

**Fix:**
- Ensure JWT_SECRET is at least 256 bits (32+ characters)
- Same secret in all environments
- Check token format: `Bearer <token>`

---

## 🔒 Security Best Practices

1. **Never commit sensitive data:**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   application-prod.properties
   ```

2. **Use strong JWT secret:**
   ```bash
   # Generate secure secret
   openssl rand -base64 32
   ```

3. **Enable HTTPS only:**
   - Both Netlify and Render provide free SSL
   - Redirect HTTP to HTTPS

4. **Validate input on backend:**
   - Use @Valid annotations
   - Sanitize user input

5. **Rate limiting:**
   - Add rate limiting to login/register endpoints

6. **Database security:**
   - Use strong passwords
   - Limit database access to backend IP only (if possible)

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
- Dashboard → Logs tab
- Real-time log streaming

### Frontend Logs (Netlify)
- Site → Deploys → Deploy log
- Functions → Function logs (if using)

### Database Monitoring (Railway)
- Project → MySQL → Metrics
- Monitor connections, queries

---

## 🚀 Final Deployment Checklist

- [ ] MySQL database deployed and accessible
- [ ] Backend deployed with correct env variables
- [ ] Backend health endpoint responding
- [ ] Frontend built with production API URL
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] JWT authentication working
- [ ] Register/Login tested
- [ ] Protected routes working
- [ ] Admin/User separation working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL/HTTPS enabled
- [ ] Error handling working
- [ ] 404 redirects configured

---

## 📝 Final URLs Template

```
🌐 LIVE APPLICATION URLS
========================

Frontend URL: https://your-app.netlify.app
Backend API URL: https://f1-backend.onrender.com
API Base URL: https://f1-backend.onrender.com/api
Swagger UI: https://f1-backend.onrender.com/swagger-ui.html

Database: Railway MySQL
Database Host: containers-us-west-xxx.railway.app

Test Credentials:
- Admin: admin@test.com / Admin123!
- User: user@test.com / User123!

========================
```

---

## 🔄 Continuous Deployment

Both Netlify and Render support auto-deployment:

1. **Push to GitHub main branch**
2. **Automatic build & deploy**
3. **Live in 2-5 minutes**

To disable auto-deploy:
- Render: Settings → Auto-Deploy → Off
- Netlify: Site Settings → Build & Deploy → Stop auto publishing

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Render | ✅ Free | 750 hrs/month, spins down after 15 min |
| Railway | ✅ Free | $5 credit/month, ~500 hrs |
| Netlify | ✅ Free | 100 GB bandwidth, 300 build minutes |
| Vercel | ✅ Free | 100 GB bandwidth, unlimited builds |
| PlanetScale | ✅ Free | 5 GB storage, 1 billion row reads |

**Total Cost: $0/month** (with limitations)

---

## 📞 Support & Troubleshooting

If you encounter issues:

1. Check logs on hosting platform
2. Verify environment variables
3. Test API endpoints with curl/Postman
4. Check browser console for errors
5. Verify CORS configuration
6. Ensure database is accessible

---

## 🎉 You're Live!

Your full-stack application is now deployed and accessible worldwide!

**Next Steps:**
- Set up custom domain
- Configure monitoring/alerts
- Set up CI/CD pipeline
- Add analytics
- Implement caching
- Optimize performance
