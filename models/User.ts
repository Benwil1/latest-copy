import mongoose, { Schema, Document, models, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Password won't be returned by default
  profilePicture?: string;
  bio?: string;
  age?: number;
  occupation?: string;
  location?: string; // Could be more structured, e.g., city, country
  preferences?: {
    lookingFor?: string[]; // e.g., ['Apartment', 'Roommate']
    budgetMin?: number;
    budgetMax?: number;
    preferredLocations?: string[];
    lifestyle?: string[]; // e.g., ['Quiet', 'Social', 'Night Owl']
  };
  matches?: mongoose.Types.ObjectId[]; // Array of User IDs
  likedListings?: mongoose.Types.ObjectId[]; // Array of Listing IDs
  createdAt: Date;
  updatedAt: Date;
  // Method to compare password
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Do not return password by default
    },
    profilePicture: {
      type: String,
      default: '/placeholder-user.jpg', // Default profile picture
    },
    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    occupation: {
      type: String,
      trim: true,
    },
    location: {
      type: String, // For simplicity, can be expanded to GeoJSON later
      trim: true,
    },
    preferences: {
      lookingFor: [String],
      budgetMin: Number,
      budgetMax: Number,
      preferredLocations: [String],
      lifestyle: [String],
    },
    matches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likedListings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the model already exists before defining it
const UserModel: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
