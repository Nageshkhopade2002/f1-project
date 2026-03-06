# Testing Guide

## Browser Testing

### 1. Test Registration
1. Open https://your-app.netlify.app/register
2. Fill form and submit
3. Check Network tab - should call POST /api/auth/register
4. Check response - should return success message

### 2. Test Login
1. Go to /login
2. Enter credentials
3. Check Network tab - should call POST /api/auth/login
4. Check response - should return token
5. Check Application tab → Local Storage → token should be saved

### 3. Test Protected Routes
1. Navigate to dashboard/profile
2. Check Network tab - Authorization header should be present
3. Should load data successfully

### 4. Test Logout
1. Click logout
2. Token should be removed from localStorage
3. Should redirect to login

## Postman Testing

### Register User
```
POST https://your-backend.onrender.com/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@test.com",
  "password": "Test123!",
  "role": "USER"
}
```

### Login
```
POST https://your-backend.onrender.com/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123!"
}
```

### Get Protected Resource
```
GET https://your-backend.onrender.com/api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

## Verification Checklist

- [ ] Frontend loads without errors
- [ ] Register works
- [ ] Login returns token
- [ ] Token stored in localStorage
- [ ] Protected routes work
- [ ] Authorization header sent
- [ ] Admin routes restricted
- [ ] Logout clears token
- [ ] No CORS errors
