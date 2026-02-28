# Railway Environment Variables Configuration

## Copy these to Railway Dashboard → Settings → Variables

### Database Configuration (Get from Railway MySQL Plugin)
```
MYSQLHOST=<your-railway-mysql-host>.railway.internal
MYSQLPORT=3306
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=<your-railway-mysql-password>
```

### Server Configuration
```
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Payment Gateway (Optional)
```
RAZORPAY_KEY_ID=rzp_test_SCDby0FyUYjR1q
RAZORPAY_KEY_SECRET=VJKsHRT8PfMosufZ7CjRZ4Lg
```

---

## How to Get MySQL Credentials

1. In Railway dashboard, click on your MySQL service
2. Go to "Variables" tab
3. Copy the values for:
   - MYSQLHOST
   - MYSQLPASSWORD
   - MYSQLDATABASE (usually "railway")
   - MYSQLUSER (usually "root")

---

## How to Add Variables to Backend Service

1. Click on your backend service (not MySQL)
2. Go to "Variables" tab
3. Click "New Variable"
4. Add each variable one by one
5. Or use "Raw Editor" to paste all at once:

```
MYSQLHOST=<paste-from-mysql-service>
MYSQLPORT=3306
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=<paste-from-mysql-service>
PORT=8080
SPRING_PROFILES_ACTIVE=prod
RAZORPAY_KEY_ID=rzp_test_SCDby0FyUYjR1q
RAZORPAY_KEY_SECRET=VJKsHRT8PfMosufZ7CjRZ4Lg
```

6. Click "Save" or "Deploy" to apply changes

---

## Verification

After adding variables, check:
- ✅ All 8 variables are listed
- ✅ No typos in variable names
- ✅ MYSQLHOST ends with `.railway.internal`
- ✅ PORT is set to 8080
- ✅ SPRING_PROFILES_ACTIVE is "prod"

Then trigger a redeploy and check logs.
