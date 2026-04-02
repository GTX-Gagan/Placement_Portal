# 📄 Resume Parser - Documentation

## Overview

The **Smart Resume Parser** is an AI-powered feature that automatically extracts structured data from PDF resumes and auto-fills student profiles. It uses advanced text processing to identify skills, education, and experience without manual data entry.

---

## ✨ Features

### **1. Intelligent Skill Extraction**
- Recognizes **200+ technology skills** (languages, frameworks, tools, databases)
- Covers: JavaScript, Python, React, Node.js, MongoDB, AWS, Docker, Kubernetes, etc.
- Returns standardized skill names for consistency

### **2. Education Detection**
- Identifies degree level (Bachelor, Master's, PhD, Diploma, etc.)
- Extracts field of study (CS, IT, Engineering, Commerce, etc.)
- Captures GPA/CGPA when available
- Supports international education keywords

### **3. Experience Extraction**
- Recognizes job titles and companies
- Detects employment duration
- Identifies employment type (Full-time, Part-time, Internship, etc.)
- Extracts role descriptions

### **4. Contact Information**
- Email address extraction
- Phone number detection
- LinkedIn profile link identification
- GitHub profile detection
- Portfolio website detection

### **5. Auto-Profile Update**
- Merges parsed skills with existing skills (no duplicates)
- Optionally auto-fills education and experience sections
- Updates contact information automatically
- All merged data is stored in MongoDB

---

## 🚀 How to Use

### **From Student Dashboard**

1. **Click "📎 Resume" button** on your profile
2. **Upload a PDF resume** (drag & drop or click to browse)
3. **Wait for parsing** (server extracts data from PDF)
4. **Review extracted data**:
   - Skills found (with count)
   - Education details (degree, field, GPA)
   - Experience entries (title, company, duration)
5. **Click "✓ Update Profile"** to save all data to your profile

### **API Endpoints**

#### **POST /api/resume/parse**
Parse resume and return extracted data (does not update profile)

```bash
curl -X POST http://localhost:5000/api/resume/parse \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "education": [
      {
        "degree": "BACHELOR",
        "field": "Computer Science",
        "gpa": "8.5/10",
        "details": "..."
      }
    ],
    "experience": [
      {
        "title": "Developer",
        "company": "Tech Company",
        "duration": "2022 - 2024",
        "description": "..."
      }
    ],
    "contact": {
      "email": "user@example.com",
      "linkedin": "john-doe",
      "github": "johndoe"
    },
    "summary": "..."
  }
}
```

#### **POST /api/resume/parse-and-update**
Parse resume AND automatically update student profile

```bash
curl -X POST http://localhost:5000/api/resume/parse-and-update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed and profile updated automatically",
  "data": {
    "skills": ["JavaScript", "React", "Node.js", ...],
    "education": [...],
    "experience": [...]
  },
  "mergedSkillsCount": 15,
  "newSkillsAdded": 5
}
```

#### **POST /api/resume/extract-skills**
Extract only skills from resume

```bash
curl -X POST http://localhost:5000/api/resume/extract-skills \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@resume.pdf"
```

#### **POST /api/resume/extract-education**
Extract only education details

#### **POST /api/resume/extract-experience**
Extract only experience details

---

## 🛠 Backend Implementation

### **File: `/backend/utils/resumeParser.js`**

**Main Function: `parseResume(fileBuffer)`**

1. **PDF Extraction**: Uses `pdf-parse` library to convert PDF to text
2. **Text Analysis**: Processes raw text to identify sections
3. **Skill Matching**: Compares against 200+ skill database
4. **Entity Extraction**: Uses regex patterns and NLP for education, experience, contact

**Supported Skills Database:**
- Programming Languages: JavaScript, Python, Java, C#, TypeScript, Go, etc.
- Web Frameworks: React, Vue, Angular, Express, Django, Flask, etc.
- Cloud Platforms: AWS, Azure, GCP
- Databases: MongoDB, PostgreSQL, MySQL, Redis, Firebase, etc.
- DevOps: Docker, Kubernetes, Jenkins, GitHub Actions, Terraform, Ansible
- Data/ML: TensorFlow, PyTorch, Keras, Scikit-learn, Pandas, NumPy
- Other: Git, Linux, SQL, REST, GraphQL, Agile, etc.

**Helper Functions:**
- `extractSkills(text)` - Identifies all found technologies
- `extractEducation(text)` - Parses education section
- `extractExperience(text)` - Identifies work history
- `extractContact(text)` - Finds emails, phone, social links
- `extractSummary(text)` - Extracts professional summary

### **File: `/backend/routes/resumeRoutes.js`**

**Endpoints:**
1. `POST /parse` - Parse and return data
2. `POST /parse-and-update` - Parse and update student profile
3. `POST /extract-skills` - Extract skills only
4. `POST /extract-education` - Extract education only
5. `POST /extract-experience` - Extract experience only

**Features:**
- Multer file upload handling (5MB limit, PDF only)
- Authentication required (Bearer token)
- Auto-merge skills to avoid duplicates
- Transaction-like updates to student document

### **Updated Models**

**StudentSchema.js** - Added fields:
```javascript
education: [{
  degree: String,      // BACHELOR, MASTER, PHD
  field: String,       // Computer Science, IT, etc.
  institution: String,
  startYear: Number,
  endYear: Number,
  gpa: String
}],

experience: [{
  title: String,       // Job title
  company: String,     // Company name
  startDate: String,
  endDate: String,
  duration: String,    // "2022 - 2024"
  description: String
}],

contact: {
  phone: String,
  linkedin: String,
  github: String,
  portfolio: String
}
```

---

## 🎨 Frontend Implementation

### **File: `/apiService.js`**

**New Methods:**
```javascript
// Parse and return data
apiService.parseResume(file)

// Parse and auto-update profile
apiService.parseResumeAndUpdate(file)

// Extract only specific sections
apiService.extractSkillsFromResume(file)
apiService.extractEducationFromResume(file)
apiService.extractExperienceFromResume(file)
```

### **File: `placement-portal.html`**

**Updated Resume Modal:**
- Enhanced UI with resume parsing section
- Shows extracted skills as tags
- Displays education and experience details
- Confirm button to apply updates
- Clear data button to reset

**JavaScript Functions:**
```javascript
handleResumeFileSelect(e)        // Handle PDF file upload
displayParsedSkills(skills)      // Show skills with styling
displayParsedEducation(education) // Display education info
displayParsedExperience(experience) // Display work history
confirmResumeUpdate()            // Save to profile
clearResumeData()               // Reset form
```

---

## 📊 Skill Database (Sample)

The parser recognizes skills across multiple categories:

**Professional Categories:**
- Languages: 15+ programming languages
- Web: 10+ frameworks and libraries
- Mobile: React Native, Flutter, iOS, Android, Xamarin
- Cloud: AWS, Azure, GCP
- Databases: 12+ database systems
- DevOps: Docker, Kubernetes, Jenkins, GitLab CI, GitHub Actions
- Data Science: TensorFlow, PyTorch, Keras, Scikit-learn, Pandas
- Tools: Git, Linux, Docker, Jira, Confluence, Slack
- Testing: Jest, Mocha, Selenium, Postman, JUnit
- Other: Agile, Scrum, REST, GraphQL, Microservices

**Total: 200+ recognized skills**

---

## ⚙️ Configuration

### **File Limits**
- Maximum file size: **5MB**
- Accepted formats: **PDF only** (currently)

### **Environment Variables**
No special env variables required for resume parser (uses same MongoDB connection)

### **Dependencies**
```json
{
  "pdf-parse": "^1.1.1",
  "pdfjs-dist": "^4.x.x",
  "natural": "^6.x.x",
  "multer": "^1.4.5"
}
```

---

## 🚨 Error Handling

**Common Errors & Solutions:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Only PDF files are allowed" | Wrong file type | Upload a PDF file |
| "Failed to parse resume" | Corrupted PDF | Try a different PDF |
| "Skills not detected" | Resume format issue | Ensure proper resume formatting |
| "Unauthorized" | Missing/invalid token | Login first |
| "Profile not found" | Account issue | Check authentication |

---

## 🔍 How Skill Matching Works

### **1. Exact Match**
```
Resume contains "Python" → Matches "Python" skill
```

### **2. Alias Match**
```
Resume contains "js" → Matches "JavaScript" skill
Resume contains "py" → Matches "Python" skill
Resume contains "k8s" → Matches "Kubernetes" skill
```

### **3. Case Insensitive**
```
Resume: "python", "PYTHON", "Python" → All matched
```

### **4. Confidence Scoring**
- **High**: Exact skill name found
- **Medium**: Alias found (alternative name)

### **5. Deduplication**
When updating profile, new parsed skills are merged with existing skills:
```javascript
const existingSkills = ["JavaScript", "React"];
const parsedSkills = ["React", "Node.js", "MongoDB"];
const merged = ["JavaScript", "React", "Node.js", "MongoDB"];
// React is not duplicated
```

---

## 📈 Best Practices for Resume Uploads

### **For Best Results:**

1. **Proper Formatting**
   - Use clear section headers (Skills, Education, Experience)
   - Single resume format (no multiple columns)
   - Standard fonts (avoid fancy fonts)

2. **Skill Section**
   - List skills clearly (comma-separated or bulleted)
   - Use standard technology names (e.g., "JavaScript" not "JS scripting")
   - Group by category if possible

3. **Education Section**
   - Include degree level and field clearly
   - Add GPA if available
   - Include graduation year

4. **Experience Section**
   - Use standard job titles
   - Include company names
   - Add duration (start - end dates)
   - List key responsibilities

---

## 🔧 Testing the Resume Parser

### **Test with Sample Resume:**

1. Visit: `http://localhost:5000/placement-portal.html`
2. Register as a student
3. Click "📎 Resume" button
4. Upload a PDF resume
5. Verify extracted data appears correctly
6. Click "✓ Update Profile"
7. Check student dashboard for updated skills

### **Using Postman/cURL:**

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# 2. Parse resume (get token from login response)
curl -X POST http://localhost:5000/api/resume/parse-and-update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@your_resume.pdf"

# 3. Check updated profile
curl http://localhost:5000/api/students/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Future Enhancements

Potential improvements for next versions:

1. **Multi-format Support**: Add support for DOCX, TXT resume formats
2. **AI-Powered Parsing**: Use GPT/Claude for better context understanding
3. **Resume Scoring**: Rate resume completeness
4. **Keyword Optimization**: Suggest skills to add based on job market
5. **ATS Compatibility**: Check if resume is ATS-optimized
6. **Language Support**: Parse resumes in multiple languages
7. **Visual Resume**: Generate visual resume from extracted data
8. **Resume Comparison**: Compare against job requirements

---

## 📚 Dependencies Documentation

- **pdf-parse**: NPM package for reading PDF files
- **pdfjs-dist**: PDF.js library for PDF processing
- **natural**: Natural language processing library
- **multer**: Express middleware for file uploads

---

## ✅ Checklist for Implementation

- [x] Install pdf-parse and dependencies
- [x] Create resumeParser.js utility
- [x] Create resumeRoutes.js with 5 endpoints
- [x] Update Student model with new fields
- [x] Update server.js to register routes
- [x] Add resume parsing methods to apiService.js
- [x] Update placement-portal.html with new UI
- [x] Add JavaScript functions for parsing
- [x] Test resume parsing workflow
- [x] Create documentation

---

## 📞 Support

For issues or questions about the resume parser:
1. Check error messages in browser console
2. Verify resume PDF format
3. Check backend logs in terminal
4. Ensure MongoDB is running
5. Verify authentication token is valid

---

**Last Updated:** March 31, 2026  
**Version:** 1.0  
**Status:** Production Ready ✓
