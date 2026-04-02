# Complete API Testing Guide

## 🚀 Quick Start

### 1. Ensure MongoDB is Running

**Option A: MongoDB Atlas (Cloud) - No installation needed**
1. Sign up at: https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update `.env` with your MongoDB Atlas connection

**Option B: Local MongoDB**
```bash
mongod
```

### 2. Update .env File

Create `.env` in the backend folder with one of these:

**MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement_portal
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-123
```

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/placement_portal
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-123
```

### 3. Start the Server

```bash
cd backend
npm start
```

You should see:
```
MongoDB connected: localhost
Student Registration API running on http://localhost:5000
```

---

## 📝 API Endpoints Guide

### Base URL
```
http://localhost:5000/api
```

---

## 1️⃣ AUTHENTICATION ENDPOINTS

### Register Student (Already Created)
```
POST /students/register
Content-Type: multipart/form-data

Body:
- name: John Doe
- email: john@example.com
- password: Password123
- skills: JavaScript,Python,React
- cgpa: 8.5
- department: Computer Science
- resume: (file)

Response:
{
  "success": true,
  "message": "Student registered successfully",
  "student": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "Password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "student": {...}
}
```

### Logout (Optional)
```
POST /auth/logout

Response:
{
  "success": true,
  "message": "Logout successful. Please discard the token."
}
```

### Verify Token
```
POST /auth/verify
Content-Type: application/json

Body:
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "success": true,
  "message": "Token is valid",
  "student_id": "..."
}
```

---

## 2️⃣ JOB ENDPOINTS

### Get All Jobs (with filters)
```
GET /jobs
GET /jobs?minCGPA=7.5
GET /jobs?skillRequired=Python
GET /jobs?department=Computer Science

Response:
{
  "success": true,
  "count": 5,
  "jobs": [
    {
      "_id": "...",
      "title": "Software Engineer",
      "company": "Google",
      "location": "San Francisco",
      "salary": {
        "min": 100000,
        "max": 150000,
        "currency": "USD"
      },
      "skills": ["JavaScript", "React", "Node.js"],
      "minCGPA": 7.0,
      "jobType": "Full-Time",
      "deadline": "2026-04-30T00:00:00.000Z",
      "applicants": 42,
      "isActive": true
    }
  ]
}
```

### Get Job Details
```
GET /jobs/:jobId

Response:
{
  "success": true,
  "job": {...}
}
```

### Apply for Job (Login Required)
```
POST /jobs/:jobId/apply
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

Body:
{
  "coverLetter": "I am interested in this position..."
}

Response:
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "_id": "...",
    "student": "...",
    "job": {
      "_id": "...",
      "title": "Software Engineer",
      "company": "Google"
    },
    "status": "Applied",
    "appliedAt": "2026-03-29T12:00:00.000Z"
  }
}
```

### Get My Applications (Login Required)
```
GET /jobs/applications/my
Authorization: Bearer YOUR_JWT_TOKEN

Response:
{
  "success": true,
  "count": 3,
  "applications": [
    {
      "_id": "...",
      "student": {...},
      "job": {...},
      "status": "Shortlisted",
      "appliedAt": "2026-03-28T10:30:00.000Z",
      "interviewDate": "2026-04-05T00:00:00.000Z",
      "interviewTime": "10:00 AM"
    }
  ]
}
```

### Get Application Details (Login Required)
```
GET /jobs/applications/:applicationId
Authorization: Bearer YOUR_JWT_TOKEN

Response:
{
  "success": true,
  "application": {...}
}
```

### Withdraw Application (Login Required)
```
DELETE /jobs/:jobId/apply
Authorization: Bearer YOUR_JWT_TOKEN

Response:
{
  "success": true,
  "message": "Application withdrawn successfully"
}
```

---

## 🧪 Testing with cURL

### 1. Register a Student
```bash
curl -X POST http://localhost:5000/api/students/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=Password123" \
  -F "skills=JavaScript,Python" \
  -F "cgpa=8.5" \
  -F "department=Computer Science" \
  -F "resume=@/path/to/resume.pdf"
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

Save the token from response, then use it for protected endpoints:

### 3. Get All Jobs
```bash
curl http://localhost:5000/api/jobs
```

### 4. Apply for a Job (Replace TOKEN and JOB_ID)
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "coverLetter": "I am very interested in this position..."
  }'
```

### 5. Get My Applications
```bash
curl http://localhost:5000/api/jobs/applications/my \
  -H "Authorization: Bearer TOKEN"
```

---

## 🧪 Testing with Postman

### Setup Authorization Header

1. In Postman, go to **Authorization** tab
2. Select **Bearer Token** from dropdown
3. Paste your JWT token from login response

### Example Request: Apply for Job

**Method:** POST  
**URL:** `http://localhost:5000/api/jobs/JOB_ID/apply`  
**Headers:** Authorization: Bearer YOUR_TOKEN  
**Body (JSON):**
```json
{
  "coverLetter": "I am interested..."
}
```

---

## Test Data

### Sample Student
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "Test@123",
  "skills": "Python,Django,PostgreSQL",
  "cgpa": 8.8,
  "department": "Computer Science"
}
```

### Sample Job (Admin would create this)
```json
{
  "title": "Junior Developer",
  "company": "TechStartup",
  "description": "Looking for junior developers...",
  "location": "Bangalore, India",
  "salary": {
    "min": 300000,
    "max": 500000,
    "currency": "INR"
  },
  "skills": ["Python", "JavaScript"],
  "minCGPA": 7.0,
  "jobType": "Full-Time",
  "deadline": "2026-05-31"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to view this"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Job not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "You have already applied for this job"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## Next Steps

1. ✅ Test student registration
2. ✅ Test login with registered email
3. ✅ Get jobs list
4. ✅ Apply for jobs (using token)
5. ✅ View my applications

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (if local) or connection string is correct (if Atlas)
- Check `.env` file for correct `MONGODB_URI`

### Token Expired
- Login again to get a fresh token
- Tokens expire after 7 days

### CORS Error
- CORS is enabled for all origins in development
- For production, update in server.js

### File Upload Failed
- Max file size: 5MB
- Allowed formats: PDF, DOC, DOCX
- Check file size and format
