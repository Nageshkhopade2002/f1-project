# Backend Deployment & Troubleshooting Guide

## Current Status

### ✅ Frontend (Vercel)
- **Status:** Build error FIXED
- **URL:** https://f1-project-virid.vercel.app
- **Last Commit:** 5fdc442 - Fixed API_BASE_URL import/export mismatch

### ⚠️ Backend (Railway)
- **Status:** NOT RESOLVING (ERR_NAME_NOT_RESOLVED)
- **Expected URL:** https://f1-project-production.up.railway.app
- **Issue:** Service appears to be down or misconfigured

### ⚠️ Database (Railway MySQL)
- **Status:** UNKNOWN - Need to verify
- **Connection:** Should be configured via Railway environment variables

---

## Railway Backend Deployment Steps

### 1. Check Railway Service Status

1. **Login to Railway:**
   - Go to https://railway.app
   - Login with your account

2. **Navigate to Project:**
   - Find "f1-project" or "f1-backend" project
   - Check if service is running (green status)

3. **Check for Errors:**
   - Look for any red error indicators
   - Check if service is suspended or stopped

### 2. Verify Environment Variables

Ensure these environment variables are set in Railway:

```properties
# Database (Railway MySQL Plugin)
MYSQLHOST=<railway-mysql-host>
MYSQLPORT=3306
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=<railway-generated-password>

# Server
PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Razorpay (Optional - for payment processing)
RAZORPAY_KEY_ID=rzp_test_SCDby0FyUYjR1q
RAZORPAY_KEY_SECRET=VJKsHRT8PfMosufZ7CjRZ4Lg
```

### 3. Check Build Configuration

Railway should detect the Spring Boot application automatically. Verify:

**Build Command:**
```bash
mvn clean package -DskipTests -Pprod
```

**Start Command:**
```bash
java -Dspring.profiles.active=prod -jar target/f1-backend-0.0.1-SNAPSHOT.jar
```

### 4. Verify Database Connection

1. **Check MySQL Service:**
   - Ensure Railway MySQL plugin is installed
   - Verify it's running and not suspended

2. **Test Connection:**
   - Use Railway's database tools
   - Or connect via MySQL client with provided credentials

3. **Verify Tables:**
   - Check if tables exist: users, teams, drivers, races, etc.
   - If not, the application should create them on first run (ddl-auto=update)

### 5. Check Application Logs

In Railway dashboard:
1. Click on your backend service
2. Go to "Deployments" tab
3. Click on latest deployment
4. View logs for errors

**Common Errors to Look For:**
- Database connection failures
- Port binding issues
- Missing environment variables
- Java version mismatch
- Memory/resource limits

---

## Troubleshooting Common Issues

### Issue 1: ERR_NAME_NOT_RESOLVED

**Possible Causes:**
1. Railway service is stopped or suspended
2. Domain not properly configured
3. Service failed to deploy

**Solutions:**
1. Check service status in Railway dashboard
2. Trigger a manual redeploy
3. Check deployment logs for errors
4. Verify custom domain settings (if any)

### Issue 2: Database Connection Failed

**Error Message:**
```
Communications link failure
```

**Solutions:**
1. Verify MySQL service is running
2. Check environment variables are correct
3. Ensure MYSQLHOST includes the full Railway hostname
4. Verify database credentials

### Issue 3: Application Won't Start

**Possible Causes:**
- Java version mismatch (needs Java 17)
- Missing dependencies
- Port already in use

**Solutions:**
1. Check Railway uses Java 17
2. Verify pom.xml dependencies
3. Ensure PORT environment variable is set
4. Check for conflicting services

### Issue 4: CORS Errors (After Backend is Running)

**Error Message:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
Backend already configured for CORS. Verify:
- `WebConfig.java` includes Vercel URL
- `SecurityConfig.java` has CORS enabled
- Both files are in the deployed code

---

## Manual Deployment Steps (If Needed)

### Option 1: Redeploy from Railway Dashboard

1. Go to Railway dashboard
2. Select your backend service
3. Click "Deploy" or "Redeploy"
4. Wait for build to complete
5. Check logs for success

### Option 2: Push to GitHub (Trigger Auto-Deploy)

If Railway is connected to GitHub:

```bash
cd c:\Users\nages\OneDrive\Desktop\f1-hub\f1-backend
git add .
git commit -m "Trigger Railway redeploy"
git push origin main
```

### Option 3: Deploy from Local (Railway CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

## Verification Checklist

Once backend is deployed, test these endpoints:

### Health Check
```bash
curl https://f1-project-production.up.railway.app/api/schedule/2026
```

### Test Endpoints
- [ ] GET /api/schedule/2026 - Returns race schedule
- [ ] GET /api/teams - Returns teams list
- [ ] GET /api/drivers - Returns drivers list
- [ ] GET /api/news - Returns news articles
- [ ] GET /uploads/F1HUB_logo2.png - Returns logo image

### Expected Response
```json
{
  "success": true,
  "data": [...]
}
```

---

## Database Setup (If Starting Fresh)

If database is empty, you can populate it:

### Option 1: Use SQL Scripts

Located in `database/` folder:
- `f1hub_complete.sql` - Full database with sample data
- `sample_races_2026.sql` - 2026 race schedule

### Option 2: Let Application Create Schema

The application will auto-create tables on first run due to:
```properties
spring.jpa.hibernate.ddl-auto=update
```

Then use admin panel to add:
1. Teams
2. Drivers
3. Circuits
4. Races
5. News articles

---

## Contact & Support

### Railway Support
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Project Links
- **Frontend:** https://f1-project-virid.vercel.app
- **Backend:** https://f1-project-production.up.railway.app
- **GitHub:** https://github.com/Nageshkhopade2002/f1-project

---

## Next Steps

1. **Immediate:**
   - [ ] Check Railway dashboard
   - [ ] Verify service status
   - [ ] Check deployment logs
   - [ ] Verify environment variables

2. **If Service is Down:**
   - [ ] Trigger manual redeploy
   - [ ] Check for billing/suspension issues
   - [ ] Verify database is running

3. **After Backend is Running:**
   - [ ] Test all API endpoints
   - [ ] Verify CORS is working
   - [ ] Test frontend integration
   - [ ] Check file uploads work

4. **Final Testing:**
   - [ ] User registration/login
   - [ ] Browse races, teams, drivers
   - [ ] Book tickets
   - [ ] Admin panel access
   - [ ] News articles display

---

## Important Notes

- Railway free tier has usage limits
- Services may sleep after inactivity
- First request after sleep may be slow
- Check Railway billing if service is suspended
- Keep environment variables secure
- Never commit sensitive credentials to git
