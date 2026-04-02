# MongoDB Atlas Quick Setup (5 minutes)

## Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Create account with your email
4. Verify email

### Step 2: Create Your First Project
1. After login, you'll see the projects page
2. Click **"Create a Project"** or accept the default project
3. Name it: `placement-portal` (or any name)
4. Click **"Create Project"**

### Step 3: Create a Cluster
1. Click **"Build a Database"** or **"Create"** button
2. Choose **"FREE"** tier (M0) - it's free forever!
3. Select your region (keeps default, e.g., us-east-1)
4. Click **"Create Cluster"**
5. **Wait 2-3 minutes** for cluster to initialize

### Step 4: Create Database User
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Fill in:
   ```
   Username: student_user
   Password: SecurePass@123
   ```
4. Choose **"Password"** authentication
5. Click **"Add User"**

### Step 5: Whitelist Your IP
1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**
   - ⚠️ For production, use specific IPs

### Step 6: Get Connection String
1. Click **"Databases"** (or "Clusters") in left menu
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** driver
5. Copy the connection string
6. It looks like:
   ```
   mongodb+srv://student_user:SecurePass@123@cluster0-abc.mongodb.net/placement_portal?retryWrites=true&w=majority
   ```

### Step 7: Update Your .env File

Save this to `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://student_user:SecurePass@123@cluster0-abc.mongodb.net/placement_portal?retryWrites=true&w=majority
JWT_SECRET=placement-portal-secret-key-2024
```

**Replace:**
- `cluster0-abc` with your actual cluster name
- `student_user` with your username
- `SecurePass@123` with your password

### Step 8: Test Connection

```bash
cd backend
npm start
```

You should see:
```
MongoDB connected: cluster0-abc.mongodb.net
Student Registration API running on http://localhost:5000
```

---

## Verify It's Working

Open another terminal:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status": "Server is running"}
```

---

## Now Test the Full API

### 1. Register a Student
```bash
curl -X POST http://localhost:5000/api/students/register \
  -F "name=Test Student" \
  -F "email=test@example.com" \
  -F "password=Password123" \
  -F "skills=JavaScript,Python" \
  -F "cgpa=8.5" \
  -F "department=Computer Science" \
  -F "resume=@C:\path\to\your\resume.pdf"
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Password123\"}"
```

Save the `token` from response

### 3. Get Jobs
```bash
curl http://localhost:5000/api/jobs
```

---

## Troubleshooting

### "Invalid credentials"
- Double-check username and password match what you set
- Re-copy the connection string from Atlas

### "IP not whitelisted"
- Go to Network Access in Atlas
- Make sure 0.0.0.0/0 is whitelisted

### "Auth failed"
- Confirm database user was created
- Make sure you're using correct username/password

### Server still won't connect
- Check internet connection
- Verify cluster is running (green status in Atlas)
- Try copying connection string again

---

## Next Steps

1. ✅ MongoDB Atlas is working
2. ✅ Server is running
3. ✅ Now test APIs with Postman or cURL
4. 📖 See `API_TESTING_GUIDE.md` for all endpoints

---

## MongoDB Atlas Dashboard

In Atlas, you can:
- **View data**: Click `Collections` to see your data
- **Run queries**: Use MongoDB Shell or Compass
- **Monitor**: Check metrics, connection count, etc.
- **Add indexes**: Optimize queries

Download **MongoDB Compass** for a visual database browser:
https://www.mongodb.com/products/compass
