# Production Deployment Fix - Step by Step

## Current Issue
- **Error:** DNS_PROBE_POSSIBLE - Domain not resolving
- **URL Tried:** f1-project-production.up.railway.app
- **Status:** Backend not accessible

---

## STEP 1: Check Railway Backend Status (DO THIS FIRST!)

1. **Login to Railway:**
   - Go to: https://railway.app
   - Login with your account

2. **Find Your Backend Service:**
   - Look for project named "f1-project" or "f1-backend" or "f1-hub"
   - Click on the backend service

3. **Check Service Status:**
   - ✅ Green = Running
   - 🔴 Red = Failed/Stopped
   - ⏸️ Gray = Suspended

4. **Get the CORRECT URL:**
   - Click on "Settings" tab
   - Look for "Domains" section
   - Copy the Railway-provided domain (e.g., `xyz.up.railway.app`)
   - **This is your actual backend URL!**

5. **Check Deployment Logs:**
   - Click "Deployments" tab
   - Click latest deployment
   - Look for errors in logs

---

## STEP 2: Fix Backend Issues

### If Service is STOPPED/FAILED:

**A. Check Environment Variables in Railway:**

Required variables (Settings → Variables):
```
MYSQLHOST=<from-railway-mysql-plugin>
MYSQLPORT=3306
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=<from-railway-mysql-plugin>
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

**B. Verify MySQL Database is Running:**
- Check if MySQL plugin is added to project
- Verify it's not suspended
- Get connection details from MySQL service

**C. Trigger Redeploy:**
- Click "Deploy" button in Railway dashboard
- Wait for build to complete
- Check logs for success

### If Service is SUSPENDED:

- Check Railway billing/usage limits
- Free tier has monthly limits
- May need to upgrade plan

---

## STEP 3: Update Frontend with Correct Backend URL

Once you have the CORRECT Railway URL from Step 1:

1. **Update `.env.production`:**
```bash
cd c:\Users\nages\OneDrive\Desktop\f1-hub\f1-frontend
```

Edit `.env.production` with the correct URL:
```
VITE_API_BASE_URL=https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app
```

2. **Rebuild and Redeploy Frontend:**
```bash
npm run build
```

Then push to Vercel (it will auto-deploy)

---

## STEP 4: Test Backend Endpoints

Once backend is running, test these URLs in browser:

```
https://YOUR-RAILWAY-URL.up.railway.app/api/schedule/2026
https://YOUR-RAILWAY-URL.up.railway.app/api/teams
https://YOUR-RAILWAY-URL.up.railway.app/api/drivers
```

Should return JSON data, not errors.

---

## STEP 5: Common Railway Issues & Fixes

### Issue: "Application failed to respond"
**Fix:** Check PORT environment variable is set to `$PORT` or `8080`

### Issue: "Database connection failed"
**Fix:** 
- Verify MySQL plugin is installed
- Check MYSQLHOST, MYSQLUSER, MYSQLPASSWORD are correct
- Ensure database is not suspended

### Issue: "Build failed"
**Fix:**
- Spring Boot version was wrong (FIXED: changed from 4.0.0 to 3.2.0)
- Run locally first: `mvn clean package -DskipTests`
- Check for Java version (needs Java 17)

### Issue: "Service keeps crashing"
**Fix:**
- Check logs for stack traces
- Verify all dependencies are correct
- Check memory limits (Railway free tier: 512MB)

---

## STEP 6: Database Setup (If Empty)

If database exists but has no data:

1. **Connect to Railway MySQL:**
   - Use MySQL Workbench or command line
   - Get credentials from Railway MySQL service

2. **Import Database:**
```bash
mysql -h <MYSQLHOST> -u root -p <MYSQLDATABASE> < c:\Users\nages\OneDrive\Desktop\f1-hub\database\f1hub_complete.sql
```

Or let the app create tables automatically (it will on first run).

---

## STEP 7: Verify Full Stack

1. **Backend Health:**
   - ✅ Railway service shows "Running"
   - ✅ API endpoints return data
   - ✅ Database connected

2. **Frontend:**
   - ✅ Vercel deployment successful
   - ✅ Points to correct backend URL
   - ✅ No CORS errors

3. **Test User Flow:**
   - ✅ Homepage loads
   - ✅ Can view races/teams/drivers
   - ✅ Can register/login
   - ✅ Can book tickets

---

## Quick Commands Reference

### Backend (Railway):
```bash
# Rebuild locally first
cd c:\Users\nages\OneDrive\Desktop\f1-hub\f1-backend
mvn clean package -DskipTests

# Push to trigger Railway deploy (if connected to GitHub)
git add .
git commit -m "Fix production deployment"
git push origin main
```

### Frontend (Vercel):
```bash
cd c:\Users\nages\OneDrive\Desktop\f1-hub\f1-frontend

# Update .env.production with correct Railway URL
# Then rebuild
npm run build

# Push to trigger Vercel deploy
git add .
git commit -m "Update backend URL"
git push origin main
```

---

## What Was Fixed

1. ✅ **Spring Boot Version:** Changed from 4.0.0 (doesn't exist) to 3.2.0
2. ⏳ **Backend URL:** Need to get correct URL from Railway dashboard
3. ⏳ **Environment Variables:** Need to verify in Railway
4. ⏳ **Database Connection:** Need to check MySQL service status

---

## Next Steps

1. **DO STEP 1 FIRST** - Get actual Railway URL and service status
2. Fix any issues found in Railway dashboard
3. Update frontend with correct backend URL
4. Test all endpoints
5. Deploy and verify

---

## Support Links

- **Railway Dashboard:** https://railway.app
- **Railway Docs:** https://docs.railway.app
- **Railway Status:** https://status.railway.app
- **Frontend (Vercel):** https://vercel.com/dashboard
