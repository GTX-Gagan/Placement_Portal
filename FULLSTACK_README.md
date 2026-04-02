# NexusPlace - Full Stack Placement Portal

A modern, intelligent placement management system with AI-powered job matching, built with a robust full-stack architecture.

## 🌟 What's New - Full Stack Implementation

The placement portal has been converted from a frontend-only application to a **complete full-stack system**:

### Previous (Frontend Only)
- ❌ Data stored in memory only
- ❌ Lost on page refresh
- ❌ No persistent storage
- ❌ Single-user experience

### Now (Full Stack)
- ✅ **Node.js + Express Backend** - Robust API server
- ✅ **MongoDB Database** - Persistent data storage
- ✅ **RESTful APIs** - Clean API architecture
- ✅ **JWT Authentication** - Secure user authentication
- ✅ **Centralized API Client** - Simplified frontend-backend communication
- ✅ **Data Validation** - Server-side validation
- ✅ **Error Handling** - Comprehensive error management

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
bash start.sh
```

### Option 2: Manual Setup

1. **Start MongoDB** (if not already running)
   ```bash
   mongod
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**
   - Create `.env` file in backend folder (see FULLSTACK_SETUP.md for details)

4. **Start backend server**
   ```bash
   npm run dev
   ```

5. **Open frontend**
   - Visit: `http://localhost:5000/placement-portal.html`

## 📋 Features

### User Authentication
- Student registration with validation
- Secure login with JWT tokens
- Session persistence across refreshes
- Logout functionality

### Job Management
- Browse all job listings
- Advanced filtering (by company, skills, CGPA)
- Detailed job information views
- Apply to multiple positions

### Student Profile
- Complete profile setup
- Skills management
- Resume upload
- CGPA and department information
- Profile completion tracking

### Intelligent Matching
- AI-powered job recommendations
- Match score based on:
  - CGPA alignment (30 points)
  - Skills match (60 points)
  - Resume status (10 points)
- Ranked recommendations

### Application Tracking
- View all applications
- Track application status
- Timeline of submissions
- Status filtering and sorting

## 🏗️ Architecture

```
Frontend (HTML/Vanilla JS)
        ↓
   apiService.js (API Client)
        ↓
Backend REST APIs
        ↓
Express.js Server
        ↓
MongoDB Database
```

### Backend Structure
```
backend/
├── server.js                    # Main entry point
├── config/database.js           # MongoDB connection
├── models/                      # Data schemas
│   ├── StudentSchema.js
│   ├── Job.js
│   └── Application.js
├── routes/                      # API endpoints
│   ├── authRoutes.js           # Auth (register, login)
│   ├── jobRoutes.js            # Jobs & applications
│   └── studentRoutes.js        # Profile management
├── middleware/                  # Request processing
│   ├── authMiddleware.js       # JWT verification
│   └── uploadMiddleware.js     # File uploads
└── utils/                       # Helper functions
    ├── tokenUtils.js           # JWT generation
    ├── emailService.js         # Notifications
    └── skillMatcher.js         # Job matching
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify` - Token verification

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Job details
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/recommended/:studentId` - Recommendations

### Applications
- `POST /api/jobs/apply/:jobId` - Submit application
- `GET /api/jobs/my-applications` - View applications
- `PUT /api/jobs/applications/:appId/status` - Update status

### Student Profile
- `GET /api/students/me` - Get profile
- `PUT /api/students/profile` - Update profile
- `PUT /api/students/profile/skills` - Update skills
- `POST /api/students/profile/resume` - Upload resume

## 🔧 Technology Stack

### Frontend
- HTML5
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests
- localStorage for client-side persistence

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Mongoose for data modeling
- bcryptjs for password hashing

### Development Tools
- npm for package management
- nodemon for auto-restart
- dotenv for environment configuration

## 📚 Database Schema

### Student
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  rollNumber: String,
  department: String,
  cgpa: Number,
  skills: [String],
  about: String,
  resumePath: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Job
```javascript
{
  _id: ObjectId,
  title: String,
  company: String,
  description: String,
  requiredSkills: [String],
  minCGPA: Number,
  salary: Number,
  deadline: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Application
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  jobId: ObjectId (ref: Job),
  status: String (applied/shortlisted/rejected/selected),
  coverLetter: String,
  appliedAt: Date,
  result: String
}
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- CORS protection
- Input validation
- MongoDB injection prevention
- Secure token storage in localStorage

## 📝 Environment Configuration

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-portal
NODE_ENV=development
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=*
```

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
- **Solution**: Ensure MongoDB is running (`mongod`)
- Check MONGODB_URI in .env file

### Issue: CORS Errors
- **Solution**: Backend must be running on http://localhost:5000
- Check CORS_ORIGIN in .env

### Issue: Port 5000 Already in Use
- **Solution**:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -i :5000
  kill -9 <PID>
  ```

### Issue: npm Install Fails
- **Solution**: Delete node_modules and package-lock.json, then reinstall
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## 🚦 Testing the Application

### Registration Flow
1. Click "Register"
2. Select "Student" role
3. Fill in all details (Name, Email, Password, Roll Number, Department, CGPA)
4. Submit
5. Auto-redirect to login

### Login Flow
1. Click "Login"
2. Select "Student" role
3. Enter email and password
4. Click "Access Portal"
5. Redirected to student dashboard

### Job Application Flow
1. Complete profile (add skills, upload resume)
2. Click "Explore Jobs"
3. Browse available positions
4. Click job to view details
5. Click "Apply Now"
6. Fill cover letter
7. Submit application

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/)
- [RESTful API Design](https://restfulapi.net/)

## 🌐 Deployment

### Prerequisites
- Node.js hosting (Heroku, Render, Railway, etc.)
- MongoDB Atlas (Cloud MongoDB)
- Environment variables configured

### Steps
1. Update MONGODB_URI to MongoDB Atlas connection string
2. Set NODE_ENV to 'production'
3. Deploy backend to hosting platform
4. Update apiService.js baseURL to production backend
5. Deploy frontend to CDN or static hosting

## 📊 Future Enhancements

- [ ] Recruiter dashboard
- [ ] Admin analytics
- [ ] Email notifications
- [ ] Interview scheduling
- [ ] Offer management
- [ ] Resume parsing with AI
- [ ] WebSocket real-time updates
- [ ] Advanced search filters
- [ ] Student-recruiter messaging
- [ ] Application timeline
- [ ] Salary insights
- [ ] Company reviews

## 💡 Contributing

To contribute to this project:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For questions or issues:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for error messages
4. Check server logs in terminal

---

**Built with ❤️ for the placement community**

*Last Updated: March 31, 2026*
