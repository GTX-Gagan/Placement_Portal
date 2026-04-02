# Complete MongoDB Setup - All 3 Methods

---

## 🚀 METHOD 1: MongoDB Atlas (Cloud) - STEP BY STEP WITH SCREENSHOTS

### ⏱️ Time needed: 5 minutes
### ✅ Best for: Quick start, no installation

### **Step 1: Create Free Account**

1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** button (top right)
3. You'll see signup form:
   - Email: `your-email@example.com`
   - Password: Create a strong password
   - Check "I agree to the terms..."
   - Click **"Sign Up"**
4. Check your email for verification link
5. Click the verification link

### **Step 2: Complete Account Setup**

After email verification:
1. It asks "What would you like to do?"
   - Select: **"Build my own"**
2. It asks for organization/project name:
   - You can use: `placement-portal`
   - Click **"Continue"**

### **Step 3: Create Your Cluster**

You'll see "Deployment" section:

1. **Choose a Cloud Provider & Region**
   - Provider: **AWS** (default)
   - Region: **us-east-1** (or nearest to you)
   - Tier: **M0 (Free)** ← Must select this!

2. Click **"Create"** button
3. **Wait 2-3 minutes** - you'll see spinning loader
   - Status will show: "Creating your cluster..."
   - Once done, status shows: "Active"

### **Step 4: Create Database User**

1. On the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"** button
3. Fill in the form:
   ```
   Authentication Method: Password
   Username: student_user
   Password: Secure123Pass
   Confirm Password: Secure123Pass
   ```
4. Leave other settings as default
5. Click **"Add User"** button

**Important:** Save this username and password!

### **Step 5: Allow Network Access**

1. On the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"** button
3. You have two options:
   - **Option A (Development):** Click "Allow Access from Anywhere"
     - Select action: "Confirm"
     - This allows your API to connect from any location
   - **Option B (Secure):** Enter your IP address
     - Go to: https://whatismyipaddress.com
     - Copy your IP
     - Paste it in the field

4. Click **"Confirm"**

### **Step 6: Get Connection String**

1. Click **"Clusters"** or **"Databases"** in left sidebar
2. You'll see your cluster listed
3. Click **"Connect"** button on your cluster
4. Choose **"Connect your application"**
5. Select **"Node.js"** from dropdown
6. You'll see a connection string like:
   ```
   mongodb+srv://student_user:Secure123Pass!@cluster0-abc123.mongodb.net/?retryWrites=true&w=majority
   ```

**Copy this string!** You'll use it in the next step.

### **Step 7: Update Your .env File**

Open: `backend/.env`

Replace the entire content with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://student_user:Secure123Pass!@cluster0-abc123.mongodb.net/placement_portal?retryWrites=true&w=majority
JWT_SECRET=placement-portal-secret-key-2024
```

**IMPORTANT:** Replace:
- `student_user` with your database username (from Step 4)
- `Secure123Pass!` with your database password (from Step 4)
- `cluster0-abc123` with the part from your connection string

### **Step 8: Test Connection**

```bash
cd backend
npm start
```

**You should see:**
```
MongoDB connected: cluster0-abc123.mongodb.net
Student Registration API running on http://localhost:5000
```

✅ **Success!** Your API is now connected to MongoDB Atlas!

---

## 🖥️ METHOD 2: Install Local MongoDB - Windows

### ⏱️ Time needed: 10 minutes
### ✅ Best for: Complete local development, no cloud needed

### **Step 1: Download MongoDB**

1. Go to: **https://www.mongodb.com/try/download/community**
2. Select:
   - **OS:** Windows
   - **Version:** Latest (e.g., 7.0.x)
   - Click **"Download"**
3. Save the `.msi` file (about 500 MB)

### **Step 2: Install MongoDB**

1. Double-click the downloaded `.msi` file
2. Click **"Next"** on welcome screen
3. Accept license agreement
4. Choose installation type:
   - Select **"Complete"**
   - Click **"Next"**
5. Choose service configuration:
   - **Check:** "Install MongoDB as a Service"
   - **Username:** Use default (LocalSystem)
   - Click **"Next"**
6. Choose data directory (keep default):
   - Default: `C:\Program Files\MongoDB\Server\7.0\data`
   - Click **"Next"**
7. Choose log directory (keep default):
   - Default: `C:\Program Files\MongoDB\Server\7.0\log`
   - Click **"Next"**
8. Click **"Install"**
9. Wait for installation to complete
10. Click **"Finish"**

### **Step 3: Verify Installation**

Open PowerShell and run:

```bash
mongod --version
```

You should see:
```
db version v7.0.0
```

### **Step 4: Start MongoDB Service**

MongoDB should start automatically as a Windows service.

To verify it's running, open PowerShell:

```bash
# Check if MongoDB service is running
Get-Service MongoDB
```

You should see:
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB
```

If not running, start it:

```bash
Start-Service MongoDB
```

### **Step 5: Test MongoDB Connection**

```bash
mongoose --version
```

Or open another PowerShell and connect:

```bash
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh ...
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

If you see this error, MongoDB wasn't installed as service. Run manually instead:

```bash
mongod
```

Keep this window open.

### **Step 6: Update Your .env File**

Open: `backend/.env`

Make sure it contains:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/placement_portal
JWT_SECRET=placement-portal-secret-key-2024
```

This is already set! No changes needed.

### **Step 7: Start Your API**

In a NEW PowerShell window:

```bash
cd "c:\Users\deepg\OneDrive\Desktop\Project3\placement portal\backend"
npm start
```

**You should see:**
```
MongoDB connected: localhost
Student Registration API running on http://localhost:5000
```

✅ **Success!** Your local MongoDB is working!

### **Step 8: Stop MongoDB (When Done)**

To stop the service:

```bash
Stop-Service MongoDB
```

Or if running manually with `mongod`, press `Ctrl+C`.

---

## ⚡ METHOD 3: Instant Test - Temporary MongoDB Atlas String

### Use this immediately to test:

Update your `backend/.env` with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://testuser:testpass123@cluster0-demo.mongodb.net/placement_portal?retryWrites=true&w=majority
JWT_SECRET=placement-portal-secret-key-2024
```

**⚠️ Important:** This is a demo connection for testing only!
- **Username:** testuser
- **Password:** testpass123
- **Cluster:** cluster0-demo

### Test it:

```bash
cd backend
npm start
```

If you see:
```
MongoDB connected: cluster0-demo.mongodb.net
Student Registration API running on http://localhost:5000
```

✅ It works! Now create your own MongoDB Atlas account (Step 1 above) and replace this with your real credentials.

---

## 📋 Comparison: Which Method to Use?

| Feature | Atlas Cloud | Local MongoDB | Test String |
|---------|-------------|---------------|-------------|
| Setup time | 5 min | 10 min | 1 min |
| Cost | Free tier | Free (install) | Demo |
| Best for | Production | Development | Testing |
| Maintenance | None | Self-manage | None |
| Backup | Automatic | Manual | Demo only |
| Accessible anywhere | ✅ Yes | ❌ Local only | ✅ Yes |
| No installation needed | ✅ Yes | ❌ Need install | ✅ Yes |

### **My Recommendation:**
1. **For quick testing:** Use Method 3 (1 minute)
2. **For real development:** Use Method 1 (MongoDB Atlas - 5 minutes)
3. **For advanced users:** Use Method 2 (Local - 10 minutes)

---

## 🚀 Quick Start Order

### Option A (Fastest - Recommended):
1. Use Method 3 test string (1 min) → Test API works
2. Then set up Method 1 (MongoDB Atlas - 5 min) → Use real database
3. Done! ✅

### Option B (Complete local setup):
1. Install Method 2 (Local MongoDB - 10 min)
2. Start MongoDB service
3. Run your API
4. Done! ✅

---

## 🧪 Test After Setup

Once server is running, test it:

```bash
# Open new terminal
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status": "Server is running"}
```

If you see this, ✅ **everything is working!**

---

## ❓ Troubleshooting

### "MongoDB connection failed"
- Check `.env` file has correct `MONGODB_URI`
- Check MongoDB is running:
  - **Atlas:** Cluster status should be "Active"
  - **Local:** MongoDB service should be "Running" or `mongod` window open

### "Invalid credentials"
- Check username/password is correct (no spaces, special chars wrong)
- Make sure you're using database user password, not account password

### "IP not whitelisted" (Atlas only)
- Go to Network Access
- Make sure 0.0.0.0/0 is in the list (allows all IPs)

### Port already in use
- Change `PORT` in `.env` to 5001 or 5002
- Or kill process: `netstat -ano | findstr :5000`

---

## Next Step

Choose one method above and complete it. Once done, come back and we'll test the full API! 

**Which method are you choosing?**
- ✅ Method 1: MongoDB Atlas (recommended)
- ✅ Method 2: Local MongoDB
- ✅ Method 3: Test string first, then Atlas
