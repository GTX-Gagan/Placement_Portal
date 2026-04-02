
# 🚀 Placement Portal

### 🎓 *Full-Stack Campus Recruitment System*

> A comprehensive full-stack placement management system designed for educational institutions to streamline recruitment and connect students with employers. 

---

## 📌 Table of Contents

* ✨ Overview
* 🔥 Key Features
* 🛠️ Technology Stack
* 🏗️ Architecture
* ⚙️ Prerequisites
* 📥 Installation
* 🔑 Configuration
* 📂 Project Structure
* 🔌 API Documentation
* ▶️ Running the Application
* 🚀 Deployment
* 🤝 Contributing
* 📜 License

---

## ✨ Overview

💡 **Placement Portal** is an enterprise-grade web application that simplifies the entire placement lifecycle.

🔹 Students → Create profiles, upload resumes, apply for jobs
🔹 Recruiters → Post jobs & manage candidates
🔹 Admins → Monitor and manage recruitment activities

### ⚡ Key Capabilities

* 📄 Automated resume parsing & skill extraction
* 🎯 Intelligent job matching
* 🔔 Real-time notifications (WebSocket)
* 📊 Advanced analytics dashboard
* ☁️ Secure cloud file storage
* 🔐 Role-based authentication

---

## 🔥 Key Features

### 👨‍🎓 Student Management

* Email-based registration
* Detailed profile creation (skills, CGPA, department)
* Resume upload (PDF, DOC, DOCX)
* JWT-based secure authentication
* Application tracking & analytics

### 💼 Job Portal

* Advanced job listings with pagination
* Multi-filter search (skills, CGPA, department)
* Smart job matching algorithm
* Application status tracking
* History management

### ⚡ Real-Time Communication

* Live notifications via Socket.io
* Instant updates on job/application status

### 📄 Resume Processing

* Automated parsing & analysis
* Skill extraction from resumes
* Multi-format support

### 📧 Email Notifications

* Account verification emails
* Application updates
* Interview scheduling alerts

### 📊 Analytics & Reporting

* Placement statistics dashboard
* Department-wise insights
* Recruitment trend analysis

---

## 🛠️ Technology Stack

### 🔙 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.io
* JWT Authentication
* Bcryptjs
* Multer
* Nodemailer
* PDF-Parse

### 🎨 Frontend

* HTML5
* CSS3
* JavaScript
* Socket.io Client

### ☁️ Infrastructure

* MongoDB Atlas
* AWS S3
* Heroku

---

## 🏗️ Architecture

```
Client Layer → API Gateway → Business Logic → Data Layer
```

🔹 Client → UI & interaction
🔹 API Layer → Authentication & routing
🔹 Logic Layer → Controllers & processing
🔹 Data Layer → Database & storage

---

## ⚙️ Prerequisites

Before starting, ensure you have:

* Node.js (v14+)
* npm (v6+)
* MongoDB Atlas / Local MongoDB
* Git
* AWS Account (optional)
* Modern browser

---

## 📥 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/placement-portal.git
cd placement-portal
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### 3️⃣ Frontend Setup

No installation required (static files). Use a local server.

---

## 🔑 Configuration

Create `.env` in backend:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret
JWT_EXPIRY=7d
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

---

## 📂 Project Structure

```
placement-portal/
 ├── backend/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 ├── uploads/
 ├── frontend files
 └── README.md
```

---

## 🔌 API Documentation

### 📝 Register

```
POST /api/auth/register
```

### 🔐 Login

```
POST /api/auth/login
```

### 💼 Get Jobs

```
GET /api/jobs
```

### 📄 Upload Resume

```
POST /api/resume/upload
```

---

## ▶️ Running the Application

### 💻 Development Mode

```bash
cd backend
npm start
```

Run frontend:

```bash
npx http-server -p 8000
```

🌐 Access:

* Main → [http://localhost:8000](http://localhost:8000)
* Backend → [http://localhost:5000](http://localhost:5000)

---

## 🚀 Deployment (Heroku)

```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

## ⚡ Performance & Security

🔒 JWT Authentication
🔑 Password hashing (bcrypt)
📦 File validation
🚫 API rate limiting
📊 Optimized queries

---

## 🐞 Troubleshooting

### MongoDB Issue

```
Check MongoDB connection or URI
```

### JWT Error

```
Verify secret key and token format
```

### File Upload Error

```
Check file size and permissions
```

---

## 🤝 Contributing

1. Fork the repo
2. Create branch
3. Commit changes
4. Push
5. Open PR

---

## 📜 License

ISC License

---

## 📞 Support

📧 [support@placementportal.com](mailto:support@placementportal.com)
🐞 Raise issue on GitHub

---

## 🙌 Acknowledgments

Built using modern full-stack technologies for efficient placement management.

---

### 📌 Project Info

**Last Updated:** April 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
