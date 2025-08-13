// API client for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(email, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async verifyCode(code, type) {
    return await this.makeRequest('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ code, type }),
    });
  }

  async resendVerification(type) {
    return await this.makeRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async resetPassword(email) {
    return await this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // User methods
  async getProfile() {
    return await this.makeRequest('/users/profile');
  }

  async updateProfile(profileData) {
    return await this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.makeRequest(`/users?${queryParams}`);
  }

  async getUserById(userId) {
    return await this.makeRequest(`/users/${userId}`);
  }

  // Match methods
  async likeUser(userId) {
    return await this.makeRequest('/matches/action', {
      method: 'POST',
      body: JSON.stringify({ target_user_id: userId, action: 'like' }),
    });
  }

  async dislikeUser(userId) {
    return await this.makeRequest('/matches/action', {
      method: 'POST',
      body: JSON.stringify({ target_user_id: userId, action: 'dislike' }),
    });
  }

  async getMatches() {
    return await this.makeRequest('/matches');
  }

  async getLikesReceived() {
    return await this.makeRequest('/matches/likes-me');
  }

  // File upload methods
  async uploadPhotos(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    return await this.makeRequest('/upload/photos', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it with boundary
      body: formData,
    });
  }

  async deletePhoto(photoId) {
    return await this.makeRequest(`/upload/photos/${photoId}`, {
      method: 'DELETE',
    });
  }

  async setPrimaryPhoto(photoId) {
    return await this.makeRequest(`/upload/photos/${photoId}/primary`, {
      method: 'PUT',
    });
  }

  async uploadVideo(file) {
    const formData = new FormData();
    formData.append('video', file);

    return await this.makeRequest('/upload/video', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it with boundary
      body: formData,
    });
  }

  // Apartment methods
  async getApartments(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.makeRequest(`/apartments?${queryParams}`);
  }

  async getApartmentById(apartmentId) {
    return await this.makeRequest(`/apartments/${apartmentId}`);
  }

  async createApartment(apartmentData) {
    return await this.makeRequest('/apartments', {
      method: 'POST',
      body: JSON.stringify(apartmentData),
    });
  }

  async updateApartment(apartmentId, apartmentData) {
    return await this.makeRequest(`/apartments/${apartmentId}`, {
      method: 'PUT',
      body: JSON.stringify(apartmentData),
    });
  }

  async deleteApartment(apartmentId) {
    return await this.makeRequest(`/apartments/${apartmentId}`, {
      method: 'DELETE',
    });
  }

  async uploadApartmentImages(apartmentId, files) {
    const formData = new FormData();
    formData.append('apartment_id', apartmentId);
    files.forEach(file => {
      formData.append('apartment_images', file);
    });

    return await this.makeRequest('/upload/apartment-images', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it with boundary
      body: formData,
    });
  }

  logout() {
    this.setToken(null);
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
