# MongoDB Atlas Setup - 5 Simple Steps (5 Minutes)

## 🎯 Goal: Get your API connected to MongoDB and running!

---

## STEP 1: Create Free Account (2 minutes)

### Click here and sign up:
```
https://www.mongodb.com/cloud/atlas
```

**On the page:**
1. Click **"Try Free"** button (green button, top right)
2. Fill in the signup form:
   - Email: `your-email@example.com`
   - Password: Something strong like `MySecure123!Pass`
3. Check the terms checkbox
4. Click **"Sign Up"**

**In your email:**
- You'll get a verification email
- Click the link to verify

✅ Now you're in MongoDB Atlas!

---

## STEP 2: Create a Free Cluster (2 minutes)

**You'll see this page:**
```
"Welcome to MongoDB Atlas!"
```

You'll see options, select:
- **"Build my own"** (left option)

**Next screen - Deployment:**
1. **Provider:** AWS (default)
2. **Region:** us-east-1 (default, or pick closest to you)
3. **Tier:** M0 FREE ← **IMPORTANT: Select M0 (it's free!)**

Click **"Create"**

🕐 **Wait 2-3 minutes** while it creates...
- You'll see spinning loader
- Status will update to "Active" (green)

✅ Your cluster is ready!

---

## STEP 3: Create Database User (1 minute)

**On the left sidebar, click:** `Database Access`

Click **"Add New Database User"**

**Fill in these fields:**
```
Username:        student_user
Password:        Secure123Pass!
Confirm Password: Secure123Pass!
```

⚠️ **Save these!** You need them in a minute.

Click **"Add User"**

✅ User created!

---

## STEP 4: Allow Network Access (30 seconds)

**On the left sidebar, click:** `Network Access`

Click **"Add IP Address"**

**You'll see two options:**
- Choose: **"Allow Access from Anywhere"**
- Click: **"Confirm"**

⚠️ For development this is fine. For production, use specific IPs.

✅ Network access allowed!

---

## STEP 5: Get Connection String & Update `.env` (1 minute)

**In the left sidebar:**
1. Click **"Databases"** or **"Clusters"**
2. You'll see your cluster
3. Click **"Connect"** button

**A popup appears:**
1. Choose **"Connect your application"** (middle option)
2. Select **"Node.js"** from dropdown
3. You'll see your connection string

**It looks like this:**
```
mongodb+srv://student_user:Secure123Pass!@cluster0-abc123.mongodb.net/?retryWrites=true&w=majority
```

**Copy this entire string!**

---

## Now Update Your `.env` File

**Open this file:**
```
backend/.env
```

**Replace the ENTIRE content with this:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://student_user:Secure123Pass!@cluster0-abc123.mongodb.net/placement_portal?retryWrites=true&w=majority
JWT_SECRET=placement-portal-secret-key-2024
```

**BUT FIRST:** Replace in the line above:
- `student_user` → the username you created (Step 3)
- `Secure123Pass!` → the password you created (Step 3)  
- `cluster0-abc123` → the part from your connection string (Step 5)

**Example (using the string from Step 5):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://student_user:Secure123Pass!@cluster0-abc123.mongodb.net/placement_portal?retryWrites=true&w=majority
JWT_SECRET=placement-portal-secret-key-2024
```

✅ File updated!

---

## 🚀 NOW TEST YOUR API

**Open PowerShell and run:**

```bash
cd "c:\Users\deepg\OneDrive\Desktop\Project3\placement portal\backend"
npm start
```

**You should see:**
```
MongoDB connected: cluster0-abc123.mongodb.net
Student Registration API running on http://localhost:5000
```

🎉 **SUCCESS!** Your API is running with MongoDB!

---

## ✅ Verify It's Working

**Open another PowerShell:**

```bash
curl http://localhost:5000/api/health
```

**You should see:**
```json
{"status": "Server is running"}
```

✅ Perfect! Everything works!

---

## 📝 Checklist

- [ ] Created MongoDB Atlas account (step 1)
- [ ] Created free cluster (step 2)
- [ ] Created database user (step 3)
- [ ] Allowed network access (step 4)
- [ ] Got connection string (step 5)
- [ ] Updated `.env` file with connection string
- [ ] Run `npm start` and see it connect
- [ ] Test with `curl http://localhost:5000/api/health`

---

## 🎓 Next Steps

Once server is running:

### Test Registration
```bash
curl -X POST http://localhost:5000/api/students/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=Password123" \
  -F "skills=JavaScript,Python" \
  -F "cgpa=8.5" \
  -F "department=Computer Science" \
  -F "resume=@C:\path\to\resume.pdf"
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"Password123\"}"
```

### View in MongoDB Atlas

After registering, you can see your data:
1. In MongoDB Atlas website
2. Click "Clusters"
3. Click "Browse Collections"
4. You'll see your data inserted!

---

## ❓ Issues?

### "MongoDB connection failed"
- Double-check your connection string in `.env`
- Make sure username/password are exactly correct
- Ensure cluster status is "Active" (green) in Atlas

### "Network access blocked"
- In Network Access (Atlas), make sure 0.0.0.0/0 is allowed
- Or add your specific IP address

### "ENOTFOUND error"
- Check internet connection
- Verify cluster is "Active" in MongoDB Atlas
- Wait 1-2 minutes after creating cluster

### Port 5000 already in use
- Change PORT in `.env` to 5001
- Or kill the process using it

---

## 💡 You're All Set!

Your placement portal API is now:
✅ Connected to MongoDB  
✅ Running locally  
✅ Ready to test  
✅ Ready to deploy  

**What's next?**
- See `API_TESTING_GUIDE.md` for all API endpoints
- Register students and test the full flow
- Deploy when ready!

---

**Questions?** The connection string, username, and password are the key parts. Make sure they match exactly in your `.env` file.
