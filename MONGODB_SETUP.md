# MongoDB Setup Options

## Option 1: MongoDB Atlas (Cloud) - EASIEST ⭐ RECOMMENDED

Perfect for development and production. Free tier available.

### Steps:

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with your email
   - Create a new project (e.g., "placement-portal")

2. **Create Cluster**
   - Click "Create" button
   - Choose FREE tier (M0 - perfect for learning)
   - Select your region (keep default or choose nearest)
   - Click "Create Cluster"
   - Wait 2-3 minutes for the cluster to initialize

3. **Create Database User**
   - Go to "Database Access" on the left menu
   - Click "Add New Database User"
   - Username: `student_user`
   - Password: `SecurePassword123!` (or choose your own, remember it!)
   - Leave other settings as default
   - Click "Add User"

4. **Get Connection String**
   - Go to "Clusters" tab
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://user:password@cluster...`)
   - Replace `<username>` and `<password>` with your database user credentials

5. **Update .env File**
   - Open `backend/.env`
   - Add or update:
   ```
   MONGODB_URI=mongodb+srv://student_user:SecurePassword123!@yourcluster.mongodb.net/placement_portal?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```

Done! Your MongoDB is ready in the cloud. No installation needed!

---

## Option 2: Local MongoDB Community Edition

If you prefer local development:

### Windows Installation:

1. **Download**
   - Go to https://www.mongodb.com/try/download/community
   - Choose Windows
   - Download MSI installer

2. **Install**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Click "Install"

3. **Verify Installation**
   - Open PowerShell
   - Run: `mongod --version`
   - Should show version number

4. **Start MongoDB Service**
   - MongoDB should start automatically
   - Or manually run: `mongod`
   - You'll see: `Waiting for connections on port 27017`

5. **Update .env File**
   ```
   MONGODB_URI=mongodb://localhost:27017/placement_portal
   PORT=5000
   NODE_ENV=development
   ```

### For Testing Locally:

Download MongoDB Compass (GUI):
- https://www.mongodb.com/products/compass
- Visual tool to see databases and collections
- Helpful for debugging

---

## Option 3: MongoDB in Docker

If you have Docker installed:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then update `.env`:
```
MONGODB_URI=mongodb://localhost:27017/placement_portal
```

---

## Verify Connection

After setting up, test the server:

```bash
cd backend
npm start
```

You should see:
```
MongoDB connected: cluster0-abc123.mongodb.net
Student Registration API running on http://localhost:5000
```

---

## Recommended for This Project

👉 **Use MongoDB Atlas (Option 1)** - No complex setup, cloud-hosted, free tier, production-ready.
