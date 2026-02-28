# Railway Environment Variables Setup

Set these environment variables in your Railway project:

## Database Configuration
DATABASE_URL=mysql://username:password@host:port/database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

## Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_SCDby0FyUYjR1q
RAZORPAY_KEY_SECRET=VJKsHRT8PfMosufZ7CjRZ4Lg

## Server Configuration
PORT=8080

## Example Railway MySQL URL format:
# DATABASE_URL=mysql://root:password@containers-us-west-123.railway.app:6543/railway

## To set these in Railway:
1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add each variable with its value