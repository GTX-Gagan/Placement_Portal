# Placement Portal

A comprehensive full-stack placement management system designed for educational institutions to streamline the recruitment process and connect students with employers.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Placement Portal is an enterprise-grade web application that facilitates the placement process in educational institutions. It provides a centralized platform where students can register, create profiles, upload resumes, and apply for job opportunities, while employers can post positions and manage applications.

**Key Capabilities:**
- Automated resume parsing and skill extraction
- Intelligent job matching based on skills and academic requirements
- Real-time notification system using WebSocket technology
- Comprehensive analytics dashboard for recruitment insights
- Secure file management with cloud storage integration
- Role-based access control and authentication

---

## Key Features

### Student Management
- User registration with email verification
- Comprehensive profile creation (skills, CGPA, department)
- Resume upload and parsing (PDF, DOC, DOCX)
- Secure authentication with JWT tokens
- Profile analytics and application tracking

### Job Portal
- Advanced job listing with pagination
- Multi-criteria filtering (CGPA, skills, department)
- Intelligent job matching algorithm
- Application status tracking
- Application history and management

### Real-Time Communication
- Live notifications using Socket.io
- Instant updates on application status changes
- Real-time job posting alerts

### Resume Processing
- Automated resume parsing and analysis
- Skill extraction from resume content
- Text analysis for application matching
- Support for multiple file formats

### Email Notifications
- Account confirmation emails
- Application status updates
- Interview scheduling notifications
- Custom notification templates

### Analytics & Reporting
- Placement statistics dashboard
- Application metrics and trends
- Department-wise analytics
- Student performance tracking
- Recruitment pipeline analysis

---

## Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **Socket.io** | Real-time bidirectional communication |
| **JWT** | Token-based authentication |
| **Bcryptjs** | Password hashing and security |
| **Multer** | File upload handling |
| **Nodemailer** | Email service |
| **PDF-Parse** | Resume parsing |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Markup structure |
| **CSS3** | Styling and responsive design |
| **JavaScript** | Client-side interactivity |
| **Socket.io Client** | Real-time communication |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database hosting |
| **AWS S3** | File storage service |
| **Heroku** | Application deployment |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (HTML5 │ CSS3 │ JavaScript │ Socket.io Client)             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    API Gateway Layer                         │
│         (Express.js │ CORS │ Authentication)                │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Business Logic Layer                       │
│    (Routes │ Controllers │ Middleware │ WebSocket)          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     Data Layer                               │
│  (MongoDB │ Mongoose │ File Storage │ Email Services)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before installing the Placement Portal, ensure you have:

- **Node.js** v14.0 or higher
- **npm** v6.0 or higher
- **MongoDB Atlas** account (or local MongoDB installation)
- **Git** for version control
- **AWS Account** (optional, for S3 file storage)
- Modern web browser with JavaScript enabled

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/placement-portal.git
cd placement-portal
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

### Step 3: Frontend Setup

Frontend files are located in the root directory. No additional installation required, but ensure you have a local web server to run HTML files.

---

## Configuration

### Step 1: Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement_portal

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name

# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Application Configuration
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

### Step 2: MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user with username and password
4. Get the connection string
5. Update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service: `mongod`
3. Set `MONGODB_URI=mongodb://localhost:27017/placement_portal`

---

## Project Structure

```
placement-portal/
│
├── backend/
│   ├── config/
│   │   └── database.js                 # MongoDB connection setup
│   │
│   ├── models/
│   │   ├── Student.js                  # Student data model
│   │   ├── StudentSchema.js            # Detailed student schema
│   │   ├── Job.js                      # Job posting model
│   │   └── Application.js              # Job application model
│   │
│   ├── routes/
│   │   ├── authRoutes.js               # Authentication endpoints
│   │   ├── studentRoutes.js            # Student profile endpoints
│   │   ├── studentProfileRoutes.js     # Profile management
│   │   ├── jobRoutes.js                # Job listing endpoints
│   │   ├── matchingRoutes.js           # Job matching endpoints
│   │   ├── resumeRoutes.js             # Resume processing
│   │   └── analyticsRoutes.js          # Analytics endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification
│   │   └── uploadMiddleware.js         # File upload configuration
│   │
│   ├── socket/
│   │   └── socketHandlers.js           # WebSocket event handlers
│   │
│   ├── utils/
│   │   ├── tokenUtils.js               # JWT utilities
│   │   ├── emailService.js             # Email sending service
│   │   ├── emailTemplates.js           # Email templates
│   │   ├── resumeParser.js             # Resume parsing logic
│   │   ├── jobMatcher.js               # Job matching algorithm
│   │   ├── skillMatcher.js             # Skill matching logic
│   │   ├── storageService.js           # File storage handling
│   │   └── fileUrlHelper.js            # File URL utilities
│   │
│   ├── uploads/                        # Stored resume files
│   ├── server.js                       # Express server entry point
│   ├── package.json                    # Dependencies
│   ├── Procfile                        # Heroku deployment config
│   └── .env                            # Environment variables
│
├── placement-portal.html               # Main portal interface
├── client-registration.html            # Registration form
├── job-matching.html                   # Job matching interface
├── style.css                           # Global styling
│
├── socketClient.js                     # WebSocket client
├── apiService.js                       # API client utilities
│
├── README.md                           # Documentation
├── FEATURES.md                         # Feature list
├── FULLSTACK_SETUP.md                  # Setup guide
├── API_TESTING_GUIDE.md                # API testing documentation
├── MONGODB_ATLAS_SETUP.md              # Database setup guide
├── DEPLOYMENT_HEROKU.md                # Deployment instructions
└── .gitignore                          # Git ignore file
```

---

## API Documentation

### Authentication Endpoints

#### Register Student
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "SecurePassword123",
  "skills": ["JavaScript", "React", "Node.js"],
  "cgpa": 3.8,
  "department": "Computer Science"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@university.edu",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@university.edu"
  }
}
```

### Job Endpoints

#### Get All Jobs
```
GET /api/jobs?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "jobs": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Frontend Developer",
      "company": "Tech Corp",
      "description": "Develop responsive web applications",
      "requiredCGPA": 3.0,
      "requiredSkills": ["JavaScript", "React"],
      "salary": 500000,
      "deadline": "2026-05-31",
      "applicantsCount": 45
    }
  ],
  "totalCount": 156,
  "totalPages": 16
}
```

#### Apply for Job
```
POST /api/jobs/:jobId/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I am interested in this position..."
}
```

**Response (201):**
```json
{
  "message": "Application submitted successfully",
  "applicationId": "507f1f77bcf86cd799439013",
  "status": "pending"
}
```

### Resume Endpoints

#### Upload Resume
```
POST /api/resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: [binary file]
```

**Response (200):**
```json
{
  "message": "Resume uploaded successfully",
  "fileUrl": "https://s3.amazonaws.com/...",
  "extractedSkills": ["JavaScript", "Python", "SQL", "Django"]
}
```

### Job Matching Endpoints

#### Get Matching Jobs
```
GET /api/matching/my-matches
Authorization: Bearer <token>

```

**Response (200):**
```json
{
  "matchingJobs": [
    {
      "jobId": "507f1f77bcf86cd799439012",
      "matchScore": 92,
      "title": "Frontend Developer",
      "matchReasons": [
        "Required CGPA matches your profile",
        "85% skill match",
        "Same department preference"
      ]
    }
  ]
}
```

### Analytics Endpoints

#### Get Placement Statistics
```
GET /api/analytics/statistics
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalApplications": 156,
  "acceptedApplications": 12,
  "averageTimeToOffer": 18,
  "topDepartments": [
    {
      "department": "Computer Science",
      "placements": 34
    }
  ]
}
```

For complete API documentation, see [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

---

## Running the Application

### Development Mode

#### Terminal 1: Start Backend Server
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

#### Terminal 2: Start MongoDB (if using local database)
```bash
mongod
```

#### Terminal 3: Open Frontend
```bash
# Option 1: Using Python (if available)
python -m http.server 8000

# Option 2: Using Node.js http-server
npx http-server -p 8000

# Option 3: Using VS Code Live Server extension
# Right-click on placement-portal.html -> Open with Live Server
```

Access the application:
- Main Portal: `http://localhost:8000/placement-portal.html`
- Registration: `http://localhost:8000/client-registration.html`
- Job Matching: `http://localhost:8000/job-matching.html`

### Production Mode

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

---

## Deployment

### Deploy to Heroku

#### Prerequisites
- Heroku CLI installed
- Heroku account created

#### Steps

1. **Login to Heroku:**
```bash
heroku login
```

2. **Create Heroku App:**
```bash
heroku create your-app-name
```

3. **Set Environment Variables:**
```bash
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set NODE_ENV="production"
```

4. **Deploy Application:**
```bash
git push heroku main
```

5. **View Logs:**
```bash
heroku logs --tail
```

For detailed deployment instructions, see [DEPLOYMENT_HEROKU.md](backend/DEPLOYMENT_HEROKU.md)

---

## Performance Optimization

- **Database Indexing:** Implemented on frequently queried fields
- **Caching Strategy:** Redis-ready architecture for token validation
- **File Compression:** Resume files automatically optimized before storage
- **API Rate Limiting:** Implemented to prevent abuse
- **WebSocket Optimization:** Efficient event broadcasting for real-time updates

---

## Security Features

- **Password Security:** Bcryptjs hashing with salt rounds
- **JWT Authentication:** Stateless token-based authentication
- **Input Validation:** Express-validator for all user inputs
- **CORS Protection:** Configured for specific origins
- **File Validation:** Strict file type and size restrictions
- **Environment Variables:** Sensitive data not exposed in code
- **HTTPS Ready:** Supports SSL/TLS deployment

---

## Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Verify MongoDB is running: mongod
2. Check MONGODB_URI in .env
3. Ensure MongoDB Atlas credentials are correct
```

### JWT Token Errors
```
Error: Invalid token

Solution:
1. Verify JWT_SECRET matches in .env
2. Check token expiration
3. Ensure Authorization header format: "Bearer <token>"
```

### File Upload Issues
```
Error: File too large

Solution:
1. Check MAX_FILE_SIZE in .env (default: 5MB)
2. Verify AWS S3 permissions if using cloud storage
3. Check disk space for local uploads
```

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/feature-name`
3. **Make your changes and commit:** `git commit -m "Add feature-name"`
4. **Push to the branch:** `git push origin feature/feature-name`
5. **Submit a Pull Request**

### Code Standards
- Follow Node.js/JavaScript best practices
- Add meaningful comments for complex logic
- Maintain consistent code formatting
- Test changes before submitting PR
- Update documentation as needed

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Support & Contact

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@placementportal.com

---

## Acknowledgments

Built with modern web technologies and best practices for educational placement management systems.

---

**Last Updated:** April 2026
**Version:** 1.0.0
**Status:** Production Ready
