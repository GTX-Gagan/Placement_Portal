/**
 * Frontend API Service
 * Handles all API calls to the backend
 * Replaces in-memory systemData with API calls
 */

class APIService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = localStorage.getItem('token') || null;
    this.currentUser = null;
  }

  // ============================================
  // AUTH ENDPOINTS
  // ============================================

  /**
   * Register a new student
   */
  async register(name, email, password, rollNumber, department, cgpa) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          rollNumber,
          department,
          cgpa: parseFloat(cgpa)
        })
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.token;
        this.currentUser = data.student;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.student));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error', error };
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.token;
        this.currentUser = data.student;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.student));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error', error };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Verify token
   */
  async verifyToken(token) {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      return { success: false, message: 'Network error' };
    }
  }

  // ============================================
  // JOB ENDPOINTS
  // ============================================

  /**
   * Get all jobs
   */
  async getAllJobs(filters = {}) {
    try {
      let url = `${this.baseURL}/jobs`;
      const params = new URLSearchParams();

      if (filters.company) params.append('company', filters.company);
      if (filters.minCGPA) params.append('minCGPA', filters.minCGPA);

      if (params.toString()) url += '?' + params.toString();

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return { success: false, message: 'Error fetching jobs', error };
    }
  }

  /**
   * Get a specific job
   */
  async getJob(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/${jobId}`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching job:', error);
      return { success: false, message: 'Error fetching job', error };
    }
  }

  /**
   * Create a new job
   */
  async createJob(jobData) {
    try {
      const response = await fetch(`${this.baseURL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(jobData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      return { success: false, message: 'Error creating job', error };
    }
  }

  /**
   * Update a job
   */
  async updateJob(jobId, jobData) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(jobData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating job:', error);
      return { success: false, message: 'Error updating job', error };
    }
  }

  /**
   * Delete a job
   */
  async deleteJob(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error deleting job:', error);
      return { success: false, message: 'Error deleting job', error };
    }
  }

  /**
   * Get recommended jobs for student
   */
  async getRecommendedJobs(studentId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/recommended/${studentId}`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      return { success: false, message: 'Error fetching recommended jobs', error };
    }
  }

  // ============================================
  // APPLICATION ENDPOINTS
  // ============================================

  /**
   * Apply for a job
   */
  async applyForJob(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });

      const result = await response.json();

      // Emit Socket.io event if successful
      if (result.success && window.socketClient) {
        const job = await this.getJobById(jobId);
        const student = await this.getMyProfile();
        
        if (job.success && student.success) {
          socketClient.emit('application:submit', {
            studentId: student.student.id,
            studentName: student.student.name,
            studentEmail: student.student.email,
            jobId: job.job._id,
            jobTitle: job.job.title,
            companyName: job.job.company,
            matchScore: 85,
            timestamp: new Date()
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error applying for job:', error);
      return { success: false, message: 'Error applying for job', error };
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId, newStatus, reason = '') {
    try {
      const response = await fetch(`${this.baseURL}/jobs/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          status: newStatus,
          reason: reason,
          changedBy: this.currentUser?.name || 'Admin'
        })
      });

      const result = await response.json();

      // Emit Socket.io event if successful
      if (result.success && window.socketClient) {
        socketClient.emit('application:statusUpdate', {
          applicationId: applicationId,
          newStatus: newStatus,
          reason: reason,
          timestamp: new Date()
        });
      }

      return result;
    } catch (error) {
      console.error('Error updating application status:', error);
      return { success: false, message: 'Error updating application', error };
    }
  }

  /**
   * Get student's applications
   */
  async getMyApplications() {
    try {
      const response = await fetch(`${this.baseURL}/jobs/my-applications`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { success: false, message: 'Error fetching applications', error };
    }
  }

  /**
   * Get all applications (admin)
   */
  async getAllApplications(status = null) {
    try {
      let url = `${this.baseURL}/jobs/all-applications`;
      if (status) url += `?status=${status}`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { success: false, message: 'Error fetching applications', error };
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await fetch(
        `${this.baseURL}/jobs/applications/${applicationId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders()
          },
          body: JSON.stringify({ status })
        }
      );

      return await response.json();
    } catch (error) {
      console.error('Error updating application:', error);
      return { success: false, message: 'Error updating application', error };
    }
  }

  // ============================================
  // STUDENT ENDPOINTS
  // ============================================

  /**
   * Get student profile
   */
  async getStudentProfile(studentId) {
    try {
      const response = await fetch(`${this.baseURL}/students/${studentId}`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching student profile:', error);
      return { success: false, message: 'Error fetching student profile', error };
    }
  }

  /**
   * Get current student's profile
   */
  async getMyProfile() {
    try {
      const response = await fetch(`${this.baseURL}/students/me`, {
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, message: 'Error fetching profile', error };
    }
  }

  /**
   * Update student profile
   */
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/students/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        this.currentUser = data.student;
        localStorage.setItem('user', JSON.stringify(data.student));
      }

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Error updating profile', error };
    }
  }

  /**
   * Update student skills
   */
  async updateSkills(skills) {
    try {
      const response = await fetch(`${this.baseURL}/students/profile/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ skills })
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating skills:', error);
      return { success: false, message: 'Error updating skills', error };
    }
  }

  /**
   * Upload resume
   */
  async uploadResume(file) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseURL}/students/profile/resume`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData
      });

      return await response.json();
    } catch (error) {
      console.error('Error uploading resume:', error);
      return { success: false, message: 'Error uploading resume', error };
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get authorization headers
   */
  getAuthHeaders() {
    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * Load token from localStorage
   */
  loadToken() {
    this.token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.token !== null && this.token !== undefined;
  }

  // ============================================
  // RESUME PARSING ENDPOINTS
  // ============================================

  /**
   * Parse resume and extract all data
   */
  async parseResume(file) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseURL}/resume/parse`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Resume parsing error:', error);
      return { success: false, message: 'Failed to parse resume', error };
    }
  }

  /**
   * Parse resume and auto-update student profile with extracted data
   */
  async parseResumeAndUpdate(file) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseURL}/resume/parse-and-update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Update local user data
        if (this.currentUser) {
          this.currentUser.skills = data.data.skills;
          this.currentUser.education = data.data.education;
          this.currentUser.experience = data.data.experience;
          localStorage.setItem('user', JSON.stringify(this.currentUser));
        }
      }

      return data;
    } catch (error) {
      console.error('Resume parsing and update error:', error);
      return { success: false, message: 'Failed to parse and update profile', error };
    }
  }

  /**
   * Extract only skills from resume
   */
  async extractSkillsFromResume(file) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseURL}/resume/extract-skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Skills extraction error:', error);
      return { success: false, message: 'Failed to extract skills', error };
    }
  }

  /**
   * Extract only education from resume
   */
  async extractEducationFromResume(file) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseURL}/resume/extract-education`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Education extraction error:', error);
      return { success: false, message: 'Failed to extract education', error };
    }
  }

  /**
   * Extract only experience from resume
   */
  async extractExperienceFromResume(file) {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${this.baseURL}/resume/extract-experience`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Experience extraction error:', error);
      return { success: false, message: 'Failed to extract experience', error };
    }
  }

  // ============================================
  // JOB MATCHING ENDPOINTS (Advanced Algorithm)
  // ============================================

  /**
   * Get ranked job matches for student
   */
  async getMyMatches(minScore = 0, limit = 50) {
    try {
      const response = await fetch(
        `${this.baseURL}/matching/my-matches?minScore=${minScore}&limit=${limit}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return { success: false, message: 'Failed to fetch matches', error };
    }
  }

  /**
   * Get detailed match analysis for a specific job
   */
  async analyzeJobMatch(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/matching/analyze/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing match:', error);
      return { success: false, message: 'Failed to analyze match', error };
    }
  }

  /**
   * Analyze multiple jobs at once
   */
  async batchAnalyzeJobs(jobIds) {
    try {
      const response = await fetch(`${this.baseURL}/matching/batch-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ jobIds })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error batch analyzing:', error);
      return { success: false, message: 'Failed to batch analyze', error };
    }
  }

  /**
   * Get matching statistics
   */
  async getMatchingStats() {
    try {
      const response = await fetch(`${this.baseURL}/matching/stats`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { success: false, message: 'Failed to fetch statistics', error };
    }
  }

  /**
   * Get AI recommendations
   */
  async getRecommendations(sortBy = 'score', limit = 20) {
    try {
      const response = await fetch(
        `${this.baseURL}/matching/recommendations?sortBy=${sortBy}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { success: false, message: 'Failed to fetch recommendations', error };
    }
  }

  /**
   * Calculate match score
   */
  calculateMatchScore(studentCGPA, studentSkills, job) {
    let score = (studentCGPA >= job.minCGPA) ? 30 : 15;
    const matchedSkills = job.requiredSkills.filter(skill =>
      studentSkills.some(studentSkill =>
        studentSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(studentSkill.toLowerCase())
      )
    ).length;
    score += (matchedSkills / Math.max(1, job.requiredSkills.length)) * 60;
    return Math.min(100, Math.round(score));
  }
}

// Initialize and export API service
const apiService = new APIService();
apiService.loadToken();
