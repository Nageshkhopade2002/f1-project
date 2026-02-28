# F1 Project Complete Deployment Guide

## Backend Deployment (Railway)

### 1. Fix Spring Boot Version
✅ Fixed: Changed from 4.0.0 to 3.2.1 in pom.xml

### 2. Environment Variables in Railway
Set these in Railway dashboard > Variables:
```
DATABASE_URL=mysql://username:password@host:port/database_name
DB_USERNAME=your_db_username  
DB_PASSWORD=your_db_password
RAZORPAY_KEY_ID=rzp_test_SCDby0FyUYjR1q
RAZORPAY_KEY_SECRET=VJKsHRT8PfMosufZ7CjRZ4Lg
PORT=8080
```

### 3. Deploy Backend
```bash
cd f1-backend
git add .
git commit -m "Fix production configuration"
git push
```

## Frontend Deployment (Vercel)

### 1. Update Production URL
✅ Fixed: Updated .env.production to use Railway URL

### 2. Build and Deploy
```bash
cd f1-frontend
npm run build
git add .
git commit -m "Update production configuration"
git push
```

## Verification Steps

1. **Check Railway Backend**: Visit https://f1-project-production.up.railway.app/api/test
2. **Check Frontend**: Visit your Vercel URL
3. **Test API Connection**: Login/register should work

## Common Issues

- **DNS Error**: Backend not deployed or wrong URL
- **CORS Error**: Check WebConfig.java CORS settings
- **Database Error**: Check Railway environment variables
- **Build Error**: Check Spring Boot version in pom.xml

## Next Steps After Deployment

1. Test all functionality
2. Update any hardcoded URLs
3. Monitor Railway logs for errors
4. Set up custom domain if needed