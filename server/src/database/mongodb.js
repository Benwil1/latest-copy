const mongoose = require('mongoose');
let MongoMemoryServerInstance = null;
let MongoMemoryServer;

try {
	// Lazy require to avoid hard dependency if not installed
	MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {
	MongoMemoryServer = null;
}

const connectDB = async () => {
	try {
		const useInMemory =
			String(process.env.USE_IN_MEMORY_DB || '').toLowerCase() === 'true';
		const mongoUri =
			process.env.MONGO_URL || 'mongodb://localhost:27017/roomieswipe';

		const connect = async (uri) => {
			const options = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
				serverSelectionTimeoutMS:
					parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
				socketTimeoutMS: 45000,
				bufferCommands: false,
			};

			await mongoose.connect(uri, options);
			console.log(
				`MongoDB connected successfully (${
					uri.includes('mongodb://127.0.0.1') || uri.includes('localhost')
						? 'local'
						: 'remote'
				})`
			);
			await createIndexes();
		};

		try {
			await connect(mongoUri);
		} catch (primaryError) {
			if (useInMemory) {
				if (!MongoMemoryServer) {
					throw new Error(
						'mongodb-memory-server is not installed, but USE_IN_MEMORY_DB is true'
					);
				}
				console.warn(
					'Primary MongoDB connection failed. Falling back to in-memory MongoDB...'
				);
				MongoMemoryServerInstance = await MongoMemoryServer.create();
				const memUri = MongoMemoryServerInstance.getUri();
				await connect(memUri);
				console.log(
					'Using in-memory MongoDB for development. Data will not persist across restarts.'
				);
			} else {
				throw primaryError;
			}
		}
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
		await db
			.collection('matches')
			.createIndex({ user_id: 1, target_user_id: 1 }, { unique: true });
		await db.collection('matches').createIndex({ user_id: 1 });
		await db.collection('matches').createIndex({ target_user_id: 1 });
		await db.collection('matches').createIndex({ created_at: -1 });

		// Message indexes
		await db
			.collection('messages')
			.createIndex({ match_id: 1, created_at: -1 });
		await db.collection('messages').createIndex({ sender_id: 1 });

		// Verification codes indexes
		await db
			.collection('verification_codes')
			.createIndex({ user_id: 1, type: 1 });
		await db
			.collection('verification_codes')
			.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

		console.log('Database indexes created successfully');
	} catch (error) {
		console.error('Error creating indexes:', error);
	}
};

module.exports = { connectDB };
