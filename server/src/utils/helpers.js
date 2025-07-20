const crypto = require('crypto');

// Generate random verification code
const generateVerificationCode = (length = 6) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)).toString();
};

// Generate secure random string
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Format phone number
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return phone; // Return as-is if format is unclear
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Calculate compatibility score between two users
const calculateCompatibilityScore = (user1, user2) => {
  let score = 0;
  let factors = 0;

  // Location compatibility (30% weight)
  if (user1.location && user2.location) {
    if (user1.location.toLowerCase() === user2.location.toLowerCase()) {
      score += 30;
    } else if (user1.location.toLowerCase().includes(user2.location.toLowerCase()) ||
               user2.location.toLowerCase().includes(user1.location.toLowerCase())) {
      score += 20;
    }
    factors += 30;
  }

  // Budget compatibility (25% weight)
  if (user1.budget && user2.budget) {
    const budgetDiff = Math.abs(user1.budget - user2.budget);
    const maxBudget = Math.max(user1.budget, user2.budget);
    const budgetCompatibility = Math.max(0, 1 - (budgetDiff / maxBudget));
    score += budgetCompatibility * 25;
    factors += 25;
  }

  // Age compatibility (15% weight)
  if (user1.age && user2.age) {
    const ageDiff = Math.abs(user1.age - user2.age);
    const ageCompatibility = Math.max(0, 1 - (ageDiff / 20)); // 20 year max difference
    score += ageCompatibility * 15;
    factors += 15;
  }

  // Lifestyle compatibility (20% weight)
  if (user1.lifestyle && user2.lifestyle) {
    try {
      const lifestyle1 = typeof user1.lifestyle === 'string' ? JSON.parse(user1.lifestyle) : user1.lifestyle;
      const lifestyle2 = typeof user2.lifestyle === 'string' ? JSON.parse(user2.lifestyle) : user2.lifestyle;
      
      let lifestyleMatches = 0;
      let lifestyleTotal = 0;

      const lifestyleKeys = ['smoking', 'pets', 'cleanliness', 'noise', 'guests'];
      lifestyleKeys.forEach(key => {
        if (lifestyle1[key] && lifestyle2[key]) {
          lifestyleTotal++;
          if (lifestyle1[key] === lifestyle2[key]) {
            lifestyleMatches++;
          }
        }
      });

      if (lifestyleTotal > 0) {
        score += (lifestyleMatches / lifestyleTotal) * 20;
      }
      factors += 20;
    } catch (e) {
      // Invalid JSON, skip lifestyle compatibility
    }
  }

  // Interests compatibility (10% weight)
  if (user1.interests && user2.interests) {
    try {
      const interests1 = typeof user1.interests === 'string' ? JSON.parse(user1.interests) : user1.interests;
      const interests2 = typeof user2.interests === 'string' ? JSON.parse(user2.interests) : user2.interests;
      
      const commonInterests = interests1.filter(interest => interests2.includes(interest));
      const totalInterests = new Set([...interests1, ...interests2]).size;
      
      if (totalInterests > 0) {
        score += (commonInterests.length / totalInterests) * 10;
      }
      factors += 10;
    } catch (e) {
      // Invalid JSON, skip interests compatibility
    }
  }

  // Normalize score
  const finalScore = factors > 0 ? Math.round((score / factors) * 100) : 50;
  return Math.max(0, Math.min(100, finalScore));
};

// Paginate results
const paginate = (page, limit, totalCount) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 20;
  const offset = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return {
    currentPage,
    itemsPerPage,
    offset,
    totalPages,
    totalCount,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

module.exports = {
  generateVerificationCode,
  generateSecureToken,
  calculateDistance,
  sanitizeInput,
  formatPhoneNumber,
  isValidEmail,
  calculateCompatibilityScore,
  paginate
};