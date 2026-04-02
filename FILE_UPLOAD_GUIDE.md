# File Upload Implementation Guide

## Overview

This guide explains how the file upload system works with **multer** for both **local storage** and **AWS S3**. The system is completely configurable via environment variables.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Local Storage Setup](#local-storage-setup)
3. [AWS S3 Setup](#aws-s3-setup)
4. [API Endpoints](#api-endpoints)
5. [Testing File Uploads](#testing-file-uploads)
6. [File URL Generation](#file-url-generation)
7. [Switching Between Storage Types](#switching-between-storage-types)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Default Configuration (Local Storage)

The system comes configured for **local storage by default**. No additional setup is needed to start.

**Your `.env` file should have:**
```env
STORAGE_TYPE=local
LOCAL_UPLOAD_DIR=uploads
```

Files will be saved to the `uploads/` folder in your backend directory.

---

## Local Storage Setup

### How It Works

- Files are stored on your server's filesystem
- Files are served statically from `/uploads` endpoint
- Perfect for development and small deployments

### Configuration

**In `backend/.env`:**
```env
# Use local storage
STORAGE_TYPE=local

# Directory to store uploaded files (relative to backend/)
LOCAL_UPLOAD_DIR=uploads
```

### File Paths

- **Uploaded files location:** `backend/uploads/`
- **File access URL:** `http://localhost:5000/uploads/filename.pdf`
- **Response format:** Returns `resumeUrl` in API responses

### Folder Organization

Files can be organized into subfolders:
```
backend/uploads/
├── resumes/
│   ├── resume-1711300000000-123456.pdf
│   └── resume-1711300000001-654321.docx
└── assignments/
    └── assignment-1711300000002-789123.pdf
```

To save files in a subfolder, pass `folder` parameter:
```bash
curl -F "resume=@resume.pdf" \
     -F "folder=resumes" \
     http://localhost:5000/api/students/register
```

---

## AWS S3 Setup

### Prerequisites

1. **AWS Account** - Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **S3 Bucket** - Create a bucket to store files
3. **AWS Credentials** - Access key and secret key

### Step 1: Create AWS Account

1. Go to [AWS Management Console](https://console.aws.amazon.com)
2. Sign up or login with your account

### Step 2: Create S3 Bucket

1. Open **S3** service
2. Click **"Create Bucket"**
3. **Bucket name:** `placement-portal-files` (or your preferred name)
4. **Region:** Select your region (e.g., us-east-1)
5. **Block Public Access:**
   - Uncheck "Block all public access" if you want public file access
   - Leave checked if files should be private (require signed URLs)
6. Click **"Create Bucket"**

### Step 3: Create IAM User with S3 Permissions

1. Go to **IAM** service
2. Click **"Users"** in the left sidebar
3. Click **"Create User"**
4. **User name:** `placement-portal-app`
5. Click **"Create User"**

6. On the user page, click **"Add permissions"** → **"Attach Inline Policy"**
7. Choose **"JSON"** tab
8. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::placement-portal-files",
        "arn:aws:s3:::placement-portal-files/*"
      ]
    }
  ]
}
```

Replace `placement-portal-files` with your bucket name.

9. Click **"Create Policy"**

### Step 4: Generate Access Keys

1. Go to **IAM** → **Users**
2. Click on your user (`placement-portal-app`)
3. Click **"Security Credentials"** tab
4. Click **"Create Access Key"**
5. Choose **"Application running outside AWS"**
6. Click **"Create Access Key"**

**Important:** Save the Access Key ID and Secret Access Key - you'll need them immediately!

### Step 5: Update `.env` Configuration

**In `backend/.env`:**

```env
# Use S3 storage
STORAGE_TYPE=s3

# AWS Credentials (from IAM user creation)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# AWS Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=placement-portal-files
```

### Step 6: Test S3 Connection

**Restart your server:**
```bash
npm start
```

**Upload a file:**
```bash
curl -X POST http://localhost:5000/api/students/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=Password123" \
  -F "skills=Python,JavaScript" \
  -F "cgpa=8.5" \
  -F "department=Computer Science" \
  -F "resume=@resume.pdf"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "student": {
    "name": "John Doe",
    "email": "john@example.com",
    "resumeUrl": "https://placement-portal-files.s3.us-east-1.amazonaws.com/resumes/resume-1711300000000-123456.pdf",
    "fileMetadata": {
      "fileName": "resume-1711300000000-123456.pdf",
      "originalName": "resume.pdf",
      "fileUrl": "https://placement-portal-files.s3.us-east-1.amazonaws.com/resumes/resume-1711300000000-123456.pdf",
      "storageType": "s3"
    }
  }
}
```

---

## API Endpoints

### Register Student with Resume

**Endpoint:**
```
POST /api/students/register
```

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | text | Yes | Student name (min 2 chars) |
| email | email | Yes | Student email (unique) |
| password | password | Yes | Password (min 6 chars, letters + numbers) |
| skills | text | Yes | Comma-separated skills (e.g., "Python,JavaScript") |
| cgpa | number | Yes | CGPA (0-10) |
| department | text | Yes | Department (Computer Science, IT, etc.) |
| resume | file | Yes | Resume file (PDF, DOC, DOCX, max 5MB) |
| folder | text | No | S3 folder name (default: "resumes") |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/students/register \
  -F "name=Alice Smith" \
  -F "email=alice@example.com" \
  -F "password=Secure123" \
  -F "skills=Java,Python,C++" \
  -F "cgpa=9.2" \
  -F "department=Computer Science" \
  -F "resume=@/path/to/resume.pdf"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "student": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "skills": ["Java", "Python", "C++"],
    "cgpa": 9.2,
    "department": "Computer Science",
    "resumeUrl": "http://localhost:5000/uploads/resume-1711300000000-123456.pdf",
    "fileMetadata": {
      "fileName": "resume-1711300000000-123456.pdf",
      "originalName": "resume.pdf",
      "size": 245000,
      "mimeType": "application/pdf",
      "uploadedAt": "2024-03-24T10:30:00.000Z",
      "fileUrl": "http://localhost:5000/uploads/resume-1711300000000-123456.pdf",
      "storageType": "local"
    }
  }
}
```

### Get Students with File URLs

**Endpoint:**
```
GET /api/students
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "students": [
    {
      "_id": "607f1f77bcf86cd799439011",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "resumeUrl": "http://localhost:5000/uploads/resume-1711300000000-123456.pdf",
      "skills": ["Java", "Python"]
    }
  ]
}
```

### Get Student by Email

**Endpoint:**
```
GET /api/students/:email
```

**Example:**
```bash
curl http://localhost:5000/api/students/alice@example.com
```

---

## Testing File Uploads

### Using cURL

#### Upload with Local Storage

```bash
cd backend

# Create a test PDF with text
echo "This is a test resume" > test-resume.txt

# Upload
curl -X POST http://localhost:5000/api/students/register \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "password=Password123" \
  -F "skills=Testing,Debugging" \
  -F "cgpa=8.0" \
  -F "department=Computer Science" \
  -F "resume=@test-resume.txt"
```

#### Upload with S3

```bash
# Same command, but file URL will be S3 URL
curl -X POST http://localhost:5000/api/students/register \
  -F "name=S3 User" \
  -F "email=s3user@example.com" \
  -F "password=Password123" \
  -F "skills=Cloud,AWS" \
  -F "cgpa=8.5" \
  -F "department=IT" \
  -F "resume=@resume.pdf"

# Response will have S3 URL:
# "resumeUrl": "https://bucket.s3.region.amazonaws.com/resumes/resume-xxx.pdf"
```

### Using Postman

1. **Create new POST request**
2. **URL:** `http://localhost:5000/api/students/register`
3. **Body tab:**
   - Select **form-data**
   - Add fields:
     | Key | Type | Value |
     |-----|------|-------|
     | name | text | John Doe |
     | email | text | john@example.com |
     | password | text | Password123 |
     | skills | text | Python,JavaScript |
     | cgpa | text | 8.5 |
     | department | text | Computer Science |
     | resume | file | (select from computer) |

4. Click **Send**

### Using Python Requests

```python
import requests

url = 'http://localhost:5000/api/students/register'

with open('resume.pdf', 'rb') as f:
    files = {'resume': f}
    data = {
        'name': 'Python User',
        'email': 'python@example.com',
        'password': 'Password123',
        'skills': 'Python,Django,Flask',
        'cgpa': '8.8',
        'department': 'Computer Science'
    }
    
    response = requests.post(url, files=files, data=data)
    print(response.json())
```

### Using JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('name', 'Node User');
form.append('email', 'node@example.com');
form.append('password', 'Password123');
form.append('skills', 'JavaScript,Node.js');
form.append('cgpa', '8.3');
form.append('department', 'IT');
form.append('resume', fs.createReadStream('resume.pdf'));

axios.post('http://localhost:5000/api/students/register', form, {
  headers: form.getHeaders()
})
.then(res => console.log(res.data))
.catch(err => console.error(err));
```

---

## File URL Generation

### How URLs Are Generated

#### For Local Storage
```
File path: uploads/resume-1711300000000-123456.pdf
File URL: http://localhost:5000/uploads/resume-1711300000000-123456.pdf
```

#### For S3 Storage
```
S3 Key: resumes/resume-1711300000000-123456.pdf
File URL: https://bucket.s3.region.amazonaws.com/resumes/resume-1711300000000-123456.pdf
```

### Accessing Files

#### Local Storage
- Files served statically by Express
- Direct HTTP access via `/uploads` route
- No authentication required (public access)

#### S3 Storage
- Files stored in S3 bucket
- Public access if bucket allows it
- Can generate signed URLs for private access (optional)

### Signed URLs for S3 (Private Files)

To access private S3 files, use the signed URL helper:

```javascript
const { getDownloadUrl } = require('./utils/fileUrlHelper');

// Get signed URL valid for 1 hour
const signedUrl = await getDownloadUrl('resumes/resume-xxx.pdf', 3600);
```

---

## Switching Between Storage Types

### From Local to S3

1. **Set up AWS S3** (see AWS S3 Setup section above)
2. **Update `.env`:**
   ```env
   STORAGE_TYPE=s3
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-bucket
   ```
3. **Restart server:** `npm start`
4. **New uploads go to S3**

### From S3 to Local

1. **Update `.env`:**
   ```env
   STORAGE_TYPE=local
   LOCAL_UPLOAD_DIR=uploads
   ```
2. **Restart server:** `npm start`
3. **New uploads go to local filesystem**

### Migrating Existing Files

#### S3 → Local
Use AWS CLI to download files:
```bash
aws s3 cp s3://bucket-name/resumes/ ./backend/uploads/resumes/
```

#### Local → S3
Use AWS CLI to upload files:
```bash
aws s3 sync ./backend/uploads/ s3://bucket-name/
```

---

## File Structure

### Project Structure with File Upload

```
backend/
├── middleware/
│   ├── uploadMiddleware.js      # Multer configuration (local & S3)
│   └── authMiddleware.js
├── utils/
│   ├── storageService.js        # Storage abstraction layer
│   ├── fileUrlHelper.js         # URL generation helpers
│   └── tokenUtils.js
├── routes/
│   ├── studentRoutes.js         # Updated with file URLs
│   ├── authRoutes.js
│   └── jobRoutes.js
├── models/
│   ├── StudentSchema.js
│   ├── Job.js
│   └── Application.js
├── uploads/                      # Local storage directory
│   ├── resume-1711300000000-123456.pdf
│   └── resume-1711300000001-654321.docx
├── server.js                     # Has static file serving
├── package.json
├── .env                          # Configuration
└── .env.example                  # Template
```

---

## Troubleshooting

### Upload Fails: "Only PDF and DOC/DOCX files are allowed"

**Problem:** File type is not supported

**Solution:** 
- Use only: `.pdf`, `.doc`, `.docx` files
- Check file MIME type:
  ```bash
  file resume.pdf
  ```

### Upload Fails: "File size exceeds limit"

**Problem:** File is larger than 5MB

**Solution:**
- Reduce file size
- To change limit, edit `uploadMiddleware.js`:
  ```javascript
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
  ```

### S3 Upload Fails: "ENOENT: no such file or directory"

**Problem:** Credentials not found or invalid

**Solution:**
- Verify `.env` has AWS credentials:
  ```env
  AWS_ACCESS_KEY_ID=xxxxx
  AWS_SECRET_ACCESS_KEY=xxxxx
  ```
- Check AWS IAM user has S3 permissions
- Verify bucket name is correct

### S3 Upload Fails: "NoSuchBucket"

**Problem:** Bucket doesn't exist

**Solution:**
- Create bucket in AWS S3
- Verify bucket name in `.env`
- Check if bucket name is globally unique (S3 requires unique names)

### File URL Not Accessible

**Problem:** Can't access file via URL

**Local Storage:**
- Verify server is running
- Check file exists in `uploads/` directory
- Use correct URL: `http://localhost:5000/uploads/filename.pdf`

**S3 Storage:**
- Check bucket policy allows public access
- Or use signed URLs with `getDownloadUrl()`
- Verify bucket name and region in `.env`

### Mixed Storage Issues (Local → S3)

**Problem:** Some uploads local, some on S3

**Solution:**
- Don't change `STORAGE_TYPE` after uploads
- If migrating, use AWS CLI to sync files
- Update database with new file URLs if needed

---

## Performance Tips

### Local Storage
- ✅ Fast for small deployments
- ✅ No external dependencies
- ❌ Doesn't scale to multiple servers
- **Best for:** Development, single-server deployments

### S3 Storage
- ✅ Scalable to unlimited files
- ✅ Works with multiple servers
- ✅ Built-in redundancy and backups
- ✅ CDN-friendly (CloudFront)
- ❌ Costs per request
- **Best for:** Production, multi-server deployments

### Optimization

#### Local Storage
```javascript
// Serve with gzip compression
app.use(compression());

// Set cache headers
app.use('/uploads', express.static('uploads', {
  maxAge: '1d'
}));
```

#### S3 Storage
```javascript
// Use CloudFront distribution
// Set bucket lifecycle policies for old files
// Enable bucket versioning for backup
```

---

## Security Considerations

### File Upload Security

1. **File Type Validation:** Already in place (PDF/DOC/DOCX only)
2. **File Size Limits:** 5MB limit configured
3. **Filename Sanitization:** Unique names generated (timestamps + random)
4. **Directory Traversal Prevention:** Multer handles this

### S3 Security

1. **IAM Permissions:** Least privilege principle
   ```json
   "Action": [
     "s3:PutObject",
     "s3:GetObject",
     "s3:DeleteObject"
   ]
   ```

2. **Bucket Policy:** Block public access unless needed
3. **Encryption:** Enable S3 bucket encryption
4. **Version Control:** Enable versioning for recovery

### Recommendations

- Use environment variables (never hardcode credentials)
- Rotate AWS access keys regularly
- Monitor S3 costs with AWS Cost Explorer
- Set up CloudTrail for audit logging
- Use signed URLs for private files

---

## Summary

| Feature | Local Storage | S3 Storage |
|---------|---------------|-----------|
| Setup Time | Immediate | 10 minutes |
| Scalability | Single server | Global |
| Cost | Free | Pay per request |
| Reliability | Filesystem | AWS infrastructure |
| CDN Support | No | Yes (CloudFront) |
| Complexity | Simple | Moderate |
| Best For | Development | Production |

---

## Quick Reference

### Enable Local Storage
```env
STORAGE_TYPE=local
LOCAL_UPLOAD_DIR=uploads
```

### Enable S3 Storage
```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=my-bucket
```

### Test Upload
```bash
curl -X POST http://localhost:5000/api/students/register \
  -F "name=Test" \
  -F "email=test@example.com" \
  -F "password=Password123" \
  -F "skills=Testing" \
  -F "cgpa=8.0" \
  -F "department=Computer Science" \
  -F "resume=@resume.pdf"
```

---

**Need help?** Check the troubleshooting section or review the code in `backend/middleware/uploadMiddleware.js` and `backend/utils/fileUrlHelper.js`.
