const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  email_verified: { type: Boolean, default: false },
  phone_verified: { type: Boolean, default: false },
  two_factor_enabled: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  profile_picture: { type: String },
  country: { type: String },
  nationality: { type: String },
  location: { type: String },
  age: { type: Number },
  gender: { type: String },
  occupation: { type: String },
  bio: { type: String },
  interests: [{ type: String }],
  languages: [{ type: String }],
  budget: { type: Number },
  preferred_location: { type: String },
  move_in_date: { type: Date },
  space_type: { type: String },
  bathroom_preference: { type: String },
  furnished_preference: { type: String },
  amenities: [{ type: String }],
  lifestyle: {
    cleanliness: { type: String },
    noise: { type: String },
    schedule: { type: String },
    pets: { type: String },
    smoking: { type: String },
    drinking: { type: String }
  },
  roommate_preferences: {
    age_range: {
      min: { type: Number },
      max: { type: Number }
    },
    gender: { type: String },
    occupation: [{ type: String }],
    lifestyle: {
      cleanliness: { type: String },
      noise: { type: String },
      schedule: { type: String },
      pets: { type: String },
      smoking: { type: String },
      drinking: { type: String }
    }
  },
  verification_status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// User Photos Schema
const userPhotoSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'User' },
  photo_url: { type: String, required: true },
  s3_key: { type: String },
  is_primary: { type: Boolean, default: false },
  order_index: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

// Matches Schema
const matchSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'User' },
  target_user_id: { type: String, required: true, ref: 'User' },
  action: { type: String, enum: ['like', 'dislike'], required: true },
  is_mutual: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

// Messages Schema
const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  match_id: { type: String, required: true, ref: 'Match' },
  sender_id: { type: String, required: true, ref: 'User' },
  message: { type: String, required: true },
  message_type: { type: String, default: 'text' },
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

// Apartments Schema
const apartmentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  owner_id: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number },
  furnished: { type: Boolean, default: false },
  amenities: [{ type: String }],
  images: [{ 
    url: { type: String },
    s3_key: { type: String }
  }],
  available_from: { type: Date },
  lease_duration: { type: String },
  deposit: { type: Number },
  utilities_included: { type: Boolean, default: false },
  pet_friendly: { type: Boolean, default: false },
  smoking_allowed: { type: Boolean, default: false },
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Verification Codes Schema
const verificationCodeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'User' },
  code: { type: String, required: true },
  type: { type: String, enum: ['email', 'phone', 'password_reset'], required: true },
  used: { type: Boolean, default: false },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

// Create compound indexes
userPhotoSchema.index({ user_id: 1, order_index: 1 });
matchSchema.index({ user_id: 1, target_user_id: 1 }, { unique: true });
messageSchema.index({ match_id: 1, created_at: -1 });
verificationCodeSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Create models
const User = mongoose.model('User', userSchema);
const UserPhoto = mongoose.model('UserPhoto', userPhotoSchema);
const Match = mongoose.model('Match', matchSchema);
const Message = mongoose.model('Message', messageSchema);
const Apartment = mongoose.model('Apartment', apartmentSchema);
const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

module.exports = {
  User,
  UserPhoto,
  Match,
  Message,
  Apartment,
  VerificationCode
};