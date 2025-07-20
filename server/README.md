# RoomieSwipe Backend API

A comprehensive backend API for the RoomieSwipe roommate matching platform built with Node.js, Express, and SQLite.

## Features

- **User Authentication**: Registration, login, email/phone verification
- **User Profiles**: Complete profile management with photos and preferences
- **Roommate Matching**: Smart compatibility scoring and matching system
- **Apartment Listings**: Create, manage, and search apartment listings
- **Real-time Messaging**: Socket.IO powered chat system
- **File Uploads**: Photo and video upload handling
- **Admin Panel**: User and content moderation tools
- **Notifications**: Email and SMS notifications
- **Security**: JWT authentication, rate limiting, input validation

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Production Start**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify email/phone
- `POST /api/auth/resend-verification` - Resend verification code
- `POST /api/auth/reset-password` - Password reset

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId` - Get user by ID
- `GET /api/users` - Search users (roommate matching)
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete account

### Apartments
- `GET /api/apartments` - Get all apartments (with filters)
- `GET /api/apartments/:id` - Get apartment by ID
- `POST /api/apartments` - Create apartment listing
- `PUT /api/apartments/:id` - Update apartment
- `DELETE /api/apartments/:id` - Delete apartment
- `GET /api/apartments/user/my-listings` - Get user's apartments

### Matches
- `POST /api/matches/action` - Like/dislike user
- `GET /api/matches` - Get user's matches
- `GET /api/matches/likes-me` - Get users who liked current user
- `GET /api/matches/compatibility/:userId` - Calculate compatibility score

### Messages
- `GET /api/messages/conversations` - Get user's conversations
- `GET /api/messages/conversations/:id/messages` - Get messages in conversation
- `POST /api/messages/send` - Send message
- `POST /api/messages/conversations` - Start new conversation
- `PUT /api/messages/conversations/:id/read` - Mark messages as read

### File Upload
- `POST /api/upload/photos` - Upload user photos
- `POST /api/upload/apartment-images` - Upload apartment images
- `POST /api/upload/video` - Upload video
- `DELETE /api/upload/photos/:photoId` - Delete photo
- `PUT /api/upload/photos/:photoId/primary` - Set primary photo

### Admin (Admin only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/apartments` - Get all apartments
- `GET /api/admin/reports` - Get all reports
- `PUT /api/admin/users/:userId/status` - Update user status
- `PUT /api/admin/apartments/:apartmentId/verify` - Verify apartment
- `PUT /api/admin/reports/:reportId/status` - Update report status

## Database Schema

The API uses SQLite with the following main tables:

- **users** - User profiles and authentication data
- **user_photos** - User profile photos
- **apartments** - Apartment listings
- **matches** - Roommate matches and likes
- **conversations** - Chat conversations
- **messages** - Chat messages
- **notifications** - User notifications
- **verification_codes** - Email/phone verification codes
- **reports** - User and content reports
- **saved_searches** - User's saved search filters

## Real-time Features

The API includes Socket.IO for real-time features:

- **Live Messaging**: Real-time chat between matched users
- **Typing Indicators**: Show when someone is typing
- **Online Status**: Track user online/offline status
- **Push Notifications**: Real-time notifications for matches and messages

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation
- **File Upload Security**: File type and size validation
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers

## Configuration

Key environment variables:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=./database/roomieswipe.db
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
FRONTEND_URL=http://localhost:3000
```

## Development

- **Hot Reload**: Uses nodemon for development
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Morgan for HTTP request logging
- **Testing**: Jest setup for unit tests

## Deployment

1. Set production environment variables
2. Run `npm run build` if you have a build step
3. Start with `npm start`
4. Ensure database directory is writable
5. Configure reverse proxy (nginx) for file uploads

## File Structure

```
server/
├── src/
│   ├── database/
│   │   └── init.js          # Database initialization
│   ├── middleware/
│   │   ├── auth.js          # Authentication middleware
│   │   ├── errorHandler.js  # Error handling
│   │   └── validation.js    # Input validation
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User management
│   │   ├── apartments.js    # Apartment listings
│   │   ├── matches.js       # Roommate matching
│   │   ├── messages.js      # Chat system
│   │   ├── upload.js        # File uploads
│   │   └── admin.js         # Admin panel
│   ├── services/
│   │   └── notification.js  # Email/SMS services
│   ├── utils/
│   │   └── helpers.js       # Utility functions
│   └── server.js            # Main server file
├── uploads/                 # File upload directory
├── database/               # SQLite database
├── package.json
└── README.md
```

This backend provides a complete foundation for the RoomieSwipe application with all the features needed for a modern roommate matching platform.