# Final Deployment Checklist

## Before Deployment
- [ ] Code tested locally
- [ ] All features working
- [ ] No console errors
- [ ] Database schema finalized
- [ ] Code pushed to GitHub

## Database Setup
- [ ] MySQL deployed on Railway/AWS
- [ ] Connection credentials saved
- [ ] Database accessible externally
- [ ] Test connection successful

## Backend Deployment
- [ ] Spring Boot deployed on Render
- [ ] All environment variables set
- [ ] JWT_SECRET generated (32+ chars)
- [ ] DATABASE_URL configured
- [ ] Health endpoint responding
- [ ] Build successful

## Frontend Deployment
- [ ] React deployed on Netlify
- [ ] VITE_API_BASE_URL set
- [ ] Build successful
- [ ] _redirects file added
- [ ] No build errors

## CORS Configuration
- [ ] FRONTEND_URL updated in backend
- [ ] Backend redeployed
- [ ] No CORS errors in browser

## Testing
- [ ] Register works
- [ ] Login returns token
- [ ] Token in localStorage
- [ ] Protected routes work
- [ ] Admin routes restricted
- [ ] API calls successful
- [ ] No 401 errors

## Security
- [ ] JWT secret secure
- [ ] No credentials in code
- [ ] HTTPS enabled
- [ ] Environment variables secure

## Final
- [ ] Frontend URL works
- [ ] Backend URL works
- [ ] Share URLs with team
- [ ] Document credentials safely

## URLs to Share
```
Frontend: https://your-app.netlify.app
Backend: https://your-backend.onrender.com/api
```
