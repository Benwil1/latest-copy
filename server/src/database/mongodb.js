const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/roomieswipe';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ phone: 1 });
    await db.collection('users').createIndex({ location: 1 });
    await db.collection('users').createIndex({ verification_status: 1 });
    
    // Match indexes
    await db.collection('matches').createIndex({ user_id: 1, target_user_id: 1 }, { unique: true });
    await db.collection('matches').createIndex({ user_id: 1 });
    await db.collection('matches').createIndex({ target_user_id: 1 });
    await db.collection('matches').createIndex({ created_at: -1 });
    
    // Message indexes
    await db.collection('messages').createIndex({ match_id: 1, created_at: -1 });
    await db.collection('messages').createIndex({ sender_id: 1 });
    
    // Verification codes indexes
    await db.collection('verification_codes').createIndex({ user_id: 1, type: 1 });
    await db.collection('verification_codes').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

module.exports = { connectDB };