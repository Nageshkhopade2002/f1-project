# CORS & Mixed Content Fix Guide

## Issues Fixed ✅

### 1. **CORS Blocking** (403 Forbidden)
- **Problem**: Backend was only allowing `localhost:5173`, blocking Vercel requests
- **Solution**: Added `https://f1-project-virid.vercel.app` to both `SecurityConfig.java` and `WebConfig.java`

### 2. **Mixed Content Warning**
- **Problem**: `.env.production` was missing `/api` suffix
- **Solution**: Updated to `https://f1-project-production.up.railway.app/api`

### 3. **Environment Variable Inconsistency**
- **Problem**: Local had `/api` suffix, production didn't
- **Solution**: Standardized both to use `/api`

---

## Deployment Steps 🚀

### Step 1: Deploy Backend to Railway
```bash
cd f1-backend
git add .
git commit -m "fix: Add Vercel domain to CORS configuration"
git push
```

**Railway will automatically redeploy your backend.**

### Step 2: Redeploy Frontend to Vercel
```bash
cd f1-frontend
git add .
git commit -m "fix: Update production API URL with /api suffix"
git push
```

**Vercel will automatically redeploy your frontend.**

---

## Verification Checklist ✓

After deployment, verify:

1. **Backend is running**: Visit `https://f1-project-production.up.railway.app/api/teams`
   - Should return JSON data (not 403)

2. **Frontend loads**: Visit `https://f1-project-virid.vercel.app`
   - No CORS errors in console
   - Images load properly
   - API calls succeed

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for:
     - ❌ No "CORS policy" errors
     - ❌ No "Mixed Content" warnings
     - ✅ Successful API responses

---

## Files Changed

### Backend (f1-backend)
- `src/main/java/com/f1hub/config/SecurityConfig.java` - Added Vercel domain to CORS
- `src/main/java/com/f1hub/config/WebConfig.java` - Removed wildcard, added explicit domain

### Frontend (f1-frontend)
- `.env.production` - Added `/api` suffix to match local config

---

## Environment Variables Reference

### Local Development (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production (.env.production)
```
VITE_API_BASE_URL=https://f1-project-production.up.railway.app/api
```

---

## Troubleshooting

### If CORS errors persist:
1. Check Railway logs: `railway logs`
2. Verify backend redeployed successfully
3. Hard refresh browser: `Ctrl + Shift + R`
4. Clear browser cache

### If images don't load:
1. Verify uploads folder exists on Railway
2. Check file permissions
3. Verify Railway serves static files from `/uploads`

### If API calls fail:
1. Check network tab in DevTools
2. Verify request URL includes `/api`
3. Check Railway backend is running
4. Verify environment variable in Vercel dashboard

---

## Additional Notes

- **CORS is configured in TWO places**: Both `SecurityConfig` and `WebConfig` must allow your domain
- **Wildcards don't work** with `allowCredentials(true)`
- **Railway auto-deploys** on git push to main branch
- **Vercel auto-deploys** on git push to main branch

---

## Support

If issues persist:
1. Check Railway dashboard for backend errors
2. Check Vercel dashboard for build logs
3. Verify environment variables in both platforms
4. Test API endpoints directly with Postman/curl
