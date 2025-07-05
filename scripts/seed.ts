import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import UserModel from '../models/User';
import ListingModel from '../models/Listing';
// Import other models if you want to seed them, e.g., MatchModel, MessageModel

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local. Make sure it is set.');
  process.exit(1);
}

const usersData = [
  {
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    password: 'password123', // Will be hashed by pre-save hook
    bio: 'Friendly and tidy, looking for a quiet place.',
    age: 28,
    occupation: 'Graphic Designer',
    location: 'New York, NY',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    preferences: {
      lookingFor: ['Roommate', 'Apartment'],
      budgetMin: 800,
      budgetMax: 1500,
      preferredLocations: ['Brooklyn', 'Manhattan'],
      lifestyle: ['Quiet', 'Early Bird'],
    },
  },
  {
    name: 'Bob The Builder',
    email: 'bob@example.com',
    password: 'password456',
    bio: 'Loves cooking and social evenings. Clean but not a neat freak.',
    age: 32,
    occupation: 'Software Engineer',
    location: 'San Francisco, CA',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    preferences: {
      lookingFor: ['Roommate'],
      budgetMin: 1000,
      budgetMax: 2000,
      preferredLocations: ['Mission District', 'SOMA'],
      lifestyle: ['Social', 'Night Owl'],
    },
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password789',
    bio: 'Student, enjoys music and studying. Needs a calm environment.',
    age: 22,
    occupation: 'Student',
    location: 'Boston, MA',
    profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    preferences: {
      lookingFor: ['Roommate'],
      budgetMin: 600,
      budgetMax: 1000,
      preferredLocations: ['Cambridge', 'Allston'],
      lifestyle: ['Quiet', 'Studious'],
    },
  }
];

const listingsData = (userIds: mongoose.Types.ObjectId[]) => [
  {
    createdBy: userIds[0], // Alice
    title: 'Cozy Room in Sunny Apartment',
    description: 'A beautiful and quiet room in a 2-bedroom apartment. Shared kitchen and bathroom. Close to amenities and transport.',
    price: 1200,
    location: { address: '123 Sunshine Ave', city: 'Brooklyn', zipCode: '11201' },
    images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop'
    ],
    roomType: 'private' as 'private' | 'shared' | 'entire' | 'studio',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 200,
    amenities: ['Furnished', 'Wi-Fi', 'Laundry in building', 'Utilities Included'],
    availabilityDate: new Date('2024-08-01'),
    leaseTerms: '1 year preferred',
    rules: ['No smoking', 'No pets'],
    isVerified: true,
  },
  {
    createdBy: userIds[1], // Bob
    title: 'Spacious Apartment Share near Downtown',
    description: 'Looking for a roommate for a large 2-bed, 2-bath apartment. Modern kitchen, balcony, and great views.',
    price: 1800, // This is Bob's half, or total? Assuming it's price for the room/share
    location: { address: '456 Tech Hub Rd', city: 'San Francisco', zipCode: '94107' },
    images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600&auto=format&fit=crop'
    ],
    roomType: 'private' as 'private' | 'shared' | 'entire' | 'studio',
    bedrooms: 1, // Room offered
    bathrooms: 1, // Private or shared? Assuming private for this price
    areaSqFt: 1100, // Total apartment area
    amenities: ['Parking', 'Gym', 'Balcony', 'Dishwasher', 'In-unit laundry'],
    availabilityDate: new Date('2024-07-15'),
    leaseTerms: '6 months minimum',
    rules: ['Cleanliness is key', 'Respectful of space'],
    isVerified: false,
  },
  {
    createdBy: userIds[0], // Alice again
    title: 'Charming Studio in Manhattan',
    description: 'A compact and charming studio apartment in a great Manhattan location. Perfect for a single professional or student.',
    price: 2200,
    location: { address: '789 City Park Ln', city: 'Manhattan', zipCode: '10001' },
    images: [
        'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600&auto=format&fit=crop'
    ],
    roomType: 'studio' as 'private' | 'shared' | 'entire' | 'studio',
    bedrooms: 0, // Studio
    bathrooms: 1,
    areaSqFt: 450,
    amenities: ['Elevator', 'Security', 'Close to subway'],
    availabilityDate: new Date('2024-09-01'),
    leaseTerms: '1 year',
    isVerified: true,
  }
];


const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected.');

    // Clear existing data
    console.log('Clearing existing User data...');
    await UserModel.deleteMany({});
    console.log('Clearing existing Listing data...');
    await ListingModel.deleteMany({});
    // Add deleteMany for other models if seeding them

    // Insert Users
    console.log('Inserting User data...');
    // Need to save one by one if pre-save hooks (like password hashing) are critical
    const createdUsers = [];
    for (const userData of usersData) {
        const user = new UserModel(userData);
        const savedUser = await user.save();
        createdUsers.push(savedUser);
    }
    console.log(`${createdUsers.length} Users inserted.`);
    const userIds = createdUsers.map(user => user._id);

    // Insert Listings
    console.log('Inserting Listing data...');
    const finalListingsData = listingsData(userIds);
    await ListingModel.insertMany(finalListingsData);
    console.log(`${finalListingsData.length} Listings inserted.`);

    // You can add seeding for Matches and Messages here if needed,
    // using the createdUserIds.

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    console.log('Closing MongoDB connection.');
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

seedDatabase();
