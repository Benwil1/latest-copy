const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DATABASE_URL || './database/roomieswipe.db';

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          email_verified BOOLEAN DEFAULT FALSE,
          phone_verified BOOLEAN DEFAULT FALSE,
          two_factor_enabled BOOLEAN DEFAULT FALSE,
          role TEXT DEFAULT 'user',
          profile_picture TEXT,
          country TEXT,
          nationality TEXT,
          location TEXT,
          age INTEGER,
          gender TEXT,
          occupation TEXT,
          bio TEXT,
          interests TEXT, -- JSON array
          languages TEXT, -- JSON array
          budget INTEGER,
          preferred_location TEXT,
          move_in_date TEXT,
          space_type TEXT,
          bathroom_preference TEXT,
          furnished_preference TEXT,
          amenities TEXT, -- JSON array
          lifestyle TEXT, -- JSON object
          roommate_preferences TEXT, -- JSON object
          verification_status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // User photos table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_photos (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          photo_url TEXT NOT NULL,
          s3_key TEXT,
          is_primary BOOLEAN DEFAULT FALSE,
          order_index INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Apartments table
      db.run(`
        CREATE TABLE IF NOT EXISTS apartments (
          id TEXT PRIMARY KEY,
          owner_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          location TEXT NOT NULL,
          price INTEGER NOT NULL,
          beds INTEGER NOT NULL,
          baths REAL NOT NULL,
          sqft INTEGER,
          available_date TEXT,
          property_type TEXT,
          furnished TEXT,
          amenities TEXT, -- JSON array
          images TEXT, -- JSON array
          verified BOOLEAN DEFAULT FALSE,
          active BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Matches table (for roommate matching)
      db.run(`
        CREATE TABLE IF NOT EXISTS matches (
          id TEXT PRIMARY KEY,
          user1_id TEXT NOT NULL,
          user2_id TEXT NOT NULL,
          user1_liked BOOLEAN DEFAULT FALSE,
          user2_liked BOOLEAN DEFAULT FALSE,
          is_mutual BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(user1_id, user2_id)
        )
      `);

      // Conversations table
      db.run(`
        CREATE TABLE IF NOT EXISTS conversations (
          id TEXT PRIMARY KEY,
          participant1_id TEXT NOT NULL,
          participant2_id TEXT NOT NULL,
          last_message_id TEXT,
          last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (participant1_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (participant2_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(participant1_id, participant2_id)
        )
      `);

      // Messages table
      db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          conversation_id TEXT NOT NULL,
          sender_id TEXT NOT NULL,
          content TEXT NOT NULL,
          message_type TEXT DEFAULT 'text',
          read_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
          FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Notifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          data TEXT, -- JSON object for additional data
          read_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Verification codes table
      db.run(`
        CREATE TABLE IF NOT EXISTS verification_codes (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          code TEXT NOT NULL,
          type TEXT NOT NULL, -- 'email' or 'phone'
          expires_at DATETIME NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Reports table
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id TEXT PRIMARY KEY,
          reporter_id TEXT NOT NULL,
          reported_user_id TEXT,
          reported_apartment_id TEXT,
          type TEXT NOT NULL, -- 'user', 'apartment', 'message'
          reason TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          resolved_at DATETIME,
          FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (reported_user_id) REFERENCES users (id) ON DELETE SET NULL,
          FOREIGN KEY (reported_apartment_id) REFERENCES apartments (id) ON DELETE SET NULL
        )
      `);

      // Saved searches table
      db.run(`
        CREATE TABLE IF NOT EXISTS saved_searches (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          filters TEXT NOT NULL, -- JSON object
          notification_enabled BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_location ON users (location)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_apartments_location ON apartments (location)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_apartments_price ON apartments (price)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_matches_users ON matches (user1_id, user2_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id)`);

      console.log('Database tables created successfully');
      resolve();
    });
  });
};

const getDatabase = () => db;

module.exports = {
  initializeDatabase,
  getDatabase
};