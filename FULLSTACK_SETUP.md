# Full Stack Placement Portal - Setup Guide

## Architecture Overview
- **Frontend**: HTML5 + Vanilla JavaScript with Fetch API
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **API Service**: Centralized API client (`apiService.js`)

## Setup Instructions

### 1. Install Dependencies

Navigate to the backend folder and install Node.js dependencies:

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-portal
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service)
net start MongoDB

# Or using MongoDB Compass GUI
```

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### 5. Open Frontend

Open `placement-portal.html` in your browser:
- Option 1: Direct file open (file:// protocol)
- Option 2: Use VS Code Live Server extension
- Option 3: Simple Python HTTP server:
```bash
# From root directory
python -m http.server 8000
# Access at http://localhost:8000/placement-portal.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Student login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify` - Verify token

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/recommended/:studentId` - Get recommended jobs
- `POST /api/jobs/apply/:jobId` - Apply for job
- `GET /api/jobs/my-applications` - Get student's applications
- `PUT /api/jobs/applications/:applicationId/status` - Update application status

### Student Profile
- `GET /api/students/:id` - Get student profile
- `GET /api/students/me` - Get current student profile (authenticated)
- `PUT /api/students/profile` - Update profile
- `PUT /api/students/profile/skills` - Update skills
- `POST /api/students/profile/resume` - Upload resume

## Project Structure

```
placement portal/
├── placement-portal.html       # Main frontend
├── apiService.js              # API client service
├── style.css                  # Frontend styles
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json           # Dependencies
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   ├── StudentSchema.js   # Student model
│   │   ├── Job.js             # Job model
│   │   └── Application.js     # Application model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── jobRoutes.js       # Job endpoints
│   │   ├── studentRoutes.js      # Student profile endpoints
│   │   └── analyticsRoutes.js # Analytics endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── uploadMiddleware.js # File upload handling
│   └── utils/
│       ├── emailService.js    # Email notifications
│       ├── tokenUtils.js      # JWT utilities
│       └── skillMatcher.js    # Job matching algorithm
```

## Key Features Implemented

### ✅ Authentication
- User registration with validation
- Secure login with JWT tokens
- Token storage in localStorage
- Automatic token refresh on app load

### ✅ Job Management
- Browse all available jobs
- Filter jobs by company, skills, and CGPA
- View detailed job information
- Apply for jobs with custom cover letters

### ✅ Student Profile
- Profile completion tracking
- Skills management
- Resume upload
- CGPA and department management
- Profile strength indicator

### ✅ Recommendation Engine
- AI-powered job matching
- Match score calculation based on:
  - CGPA requirements (30 points)
  - Skill alignment (60 points)
  - Resume status (10 points)
- Ranked job recommendations

### ✅ Application Tracking
- Track all job applications
- View application status
- Timeline of applications
- Status filtering

## Testing the Application

### Test Account
- **Email**: Use any valid email
- **Password**: Any string with min 6 characters
- **Role**: "Student"
- **Department**: Select from dropdown
- **CGPA**: 6.5-9.0

### Test Workflow
1. Register a new student account
2. Complete profile by adding skills and bio
3. Upload a resume
4. View recommended jobs
5. Apply for jobs
6. Track applications

## API Client Usage

The `apiService.js` provides a centralized API client:

```javascript
// Authentication
await apiService.register(name, email, password, rollNumber, dept, cgpa);
await apiService.login(email, password);
await apiService.logout();

// Jobs
await apiService.getAllJobs({ company, minCGPA });
await apiService.getJob(jobId);
await apiService.getRecommendedJobs(studentId);
await apiService.applyForJob(jobId);

// Profile
await apiService.getMyProfile();
await apiService.updateProfile({ skills, about, cgpa });
await apiService.uploadResume(file);

// Applications
await apiService.getMyApplications();
await apiService.updateApplicationStatus(appId, status);
```

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure:
- Backend is running on `http://localhost:5000`
- Frontend CORS is properly configured in `server.js`
- API calls use the correct base URL

### MongoDB Connection
If MongoDB connection fails:
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify MongoDB is listening on default port (27017)

### Token Expiration
- Tokens are stored in localStorage
- Tokens persist across page refreshes
- Clear localStorage to force re-authentication

## Future Enhancements

- [ ] Recruiter dashboard with job posting management
- [ ] Admin analytics dashboard
- [ ] Email notifications for application updates
- [ ] Interview scheduling system
- [ ] Offer management
- [ ] Resume parsing and AI matching
- [ ] Real-time notifications WebSocket
- [ ] Advanced search and filters
- [ ] Student messaging between recruiter and candidates
- [ ] Analytics and reporting

## Support

For issues or questions:
1. Check browser console for error messages
2. Check backend server logs
3. Ensure all services are running
4. Check environment variables are correctly set
