const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: Joi.string().min(8).required(),
    country: Joi.string().optional(),
    nationality: Joi.string().optional(),
    location: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    bio: Joi.string().max(500).optional(),
    occupation: Joi.string().max(100).optional(),
    location: Joi.string().max(100).optional(),
    age: Joi.number().min(18).max(100).optional(),
    gender: Joi.string().valid('male', 'female', 'non-binary', 'other', 'prefer-not-to-say').optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    budget: Joi.number().min(0).optional(),
    preferred_location: Joi.string().optional(),
    move_in_date: Joi.string().optional(),
    space_type: Joi.string().optional(),
    bathroom_preference: Joi.string().optional(),
    furnished_preference: Joi.string().optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    lifestyle: Joi.object().optional(),
    roommate_preferences: Joi.object().optional()
  }),

  createApartment: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().max(1000).optional(),
    location: Joi.string().required(),
    price: Joi.number().min(0).required(),
    beds: Joi.number().min(0).required(),
    baths: Joi.number().min(0).required(),
    sqft: Joi.number().min(0).optional(),
    available_date: Joi.string().optional(),
    property_type: Joi.string().optional(),
    furnished: Joi.string().optional(),
    amenities: Joi.array().items(Joi.string()).optional()
  }),

  sendMessage: Joi.object({
    conversation_id: Joi.string().required(),
    content: Joi.string().min(1).max(1000).required(),
    message_type: Joi.string().valid('text', 'image', 'file').default('text')
  }),

  verifyCode: Joi.object({
    code: Joi.string().length(6).pattern(/^\d+$/).required(),
    type: Joi.string().valid('email', 'phone').required()
  })
};

module.exports = {
  validateRequest,
  schemas
};