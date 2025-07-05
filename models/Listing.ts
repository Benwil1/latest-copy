import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IListing extends Document {
  createdBy: mongoose.Types.ObjectId; // Reference to User
  title: string;
  description: string;
  price: number;
  location: {
    address: string; // Full address
    // Consider adding GeoJSON for geospatial queries later
    // type: { type: String, enum: ['Point'], default: 'Point' },
    // coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    city: string;
    zipCode: string;
  };
  images: string[]; // Array of image URLs
  roomType: 'private' | 'shared' | 'entire' | 'studio';
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  amenities: string[]; // e.g., ['Parking', 'Gym', 'Balcony', 'Pet-friendly', 'Furnished']
  availabilityDate: Date;
  leaseTerms?: string; // e.g., "6 months", "1 year", "Flexible"
  rules?: string[]; // e.g., ["No smoking", "No pets (negotiable)"]
  isVerified: boolean; // Admin verified or self-verified
  likedBy: mongoose.Types.ObjectId[]; // Array of User IDs who liked this listing
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema<IListing> = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for your listing'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide the monthly rent'],
      min: 0,
    },
    location: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      // Example for GeoJSON if you add it later
      // type: { type: String, enum: ['Point'], default: 'Point' },
      // coordinates: { type: [Number], index: '2dsphere' }
    },
    images: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 10 images'],
      default: ['/placeholder.jpg'], // Default placeholder image
    },
    roomType: {
      type: String,
      enum: ['private', 'shared', 'entire', 'studio'],
      required: [true, 'Please specify the room type'],
    },
    bedrooms: {
      type: Number,
      min: 0,
    },
    bathrooms: {
      type: Number,
      min: 0,
    },
    areaSqFt: {
      type: Number,
      min: 0,
    },
    amenities: [String],
    availabilityDate: {
      type: Date,
      required: [true, 'Please specify the availability date'],
    },
    leaseTerms: String,
    rules: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val: string[]): boolean {
  return val.length <= 10;
}

// Indexing example (consider adding more based on query patterns)
ListingSchema.index({ price: 1, location: 1 });
ListingSchema.index({ createdBy: 1 });


const ListingModel: Model<IListing> = models.Listing || mongoose.model<IListing>('Listing', ListingSchema);

export default ListingModel;
