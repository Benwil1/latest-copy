# RoomEase API Documentation

This document provides details on the available API endpoints for the RoomEase application.

**Base URL:** `/api` (e.g., `http://localhost:3000/api`)

**Authentication:** Most endpoints require JWT authentication. The token should be sent as an HttpOnly cookie named `token`, which is set upon successful login. Some protected endpoints might also accept a Bearer token in the `Authorization` header for non-browser clients, though current implementation primarily relies on cookies via middleware.

---

## 1. Authentication (`/api/auth`)

### 1.1. User Signup

*   **Endpoint:** `POST /api/auth/signup`
*   **Description:** Registers a new user.
*   **Request Body:**
    ```json
    {
      "name": "string (required)",
      "email": "string (required, valid email, unique)",
      "password": "string (required, min 6 characters)"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "createdAt": "Date",
        "updatedAt": "Date"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing fields, validation error (e.g., invalid email, password too short), user already exists.
        ```json
        // Example: User already exists
        { "success": false, "message": "User already exists with this email" }
        // Example: Validation error
        { "success": false, "message": "Validation Error", "errors": { "password": "Password must be at least 6 characters" } }
        ```
    *   `500 Internal Server Error`: Server-side issue.

### 1.2. User Login

*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Logs in an existing user.
*   **Request Body:**
    ```json
    {
      "email": "string (required)",
      "password": "string (required)"
    }
    ```
*   **Success Response (200 OK):**
    *   Sets `token` HttpOnly cookie.
    ```json
    {
      "success": true,
      "message": "Logged in successfully",
      "token": "string (JWT)", // Also returned in body for flexibility
      "data": {
        "_id": "ObjectId",
        "name": "string",
        "email": "string"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing email or password.
    *   `401 Unauthorized`: Invalid credentials.
    *   `500 Internal Server Error`.

### 1.3. Get Current User

*   **Endpoint:** `GET /api/auth/me`
*   **Description:** Retrieves the profile of the currently authenticated user.
*   **Authentication:** JWT required.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "profilePicture": "string (optional)",
        "bio": "string (optional)",
        // ... other user fields from UserModel (excluding password)
        "createdAt": "Date",
        "updatedAt": "Date"
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Not authenticated or invalid/expired token.
    *   `404 Not Found`: User associated with token not found.
    *   `500 Internal Server Error`.

---

## 2. Users (`/api/users`)

### 2.1. Get User Profile by ID

*   **Endpoint:** `GET /api/users/{id}`
*   **Description:** Retrieves a specific user's public profile.
*   **Path Parameters:**
    *   `id`: `ObjectId` (User's ID)
*   **Authentication:** Not strictly required for viewing public profiles, but some details might be hidden if not authenticated or not the profile owner. (Current implementation allows public GET).
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        // User object, excluding password
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid user ID format.
    *   `404 Not Found`: User not found.
    *   `500 Internal Server Error`.

### 2.2. Update User Profile

*   **Endpoint:** `PUT /api/users/{id}`
*   **Description:** Updates the profile of the authenticated user. Users can only update their own profiles.
*   **Path Parameters:**
    *   `id`: `ObjectId` (User's ID to update - must match authenticated user's ID)
*   **Authentication:** JWT required.
*   **Request Body (Partial IUser, excluding password):**
    ```json
    {
      "name": "string (optional)",
      "profilePicture": "string (URL, optional)",
      "bio": "string (optional)",
      "age": "number (optional)",
      "occupation": "string (optional)",
      "location": "string (optional)",
      "preferences": { /* object, optional */ }
    }
    ```
    *Note: Password cannot be updated via this route.*
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        // Updated user object, excluding password
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid user ID format, validation error, attempt to update password.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: Attempting to update another user's profile.
    *   `404 Not Found`: User not found.
    *   `500 Internal Server Error`.

---

## 3. Listings (`/api/listings`)

### 3.1. Create New Listing

*   **Endpoint:** `POST /api/listings`
*   **Description:** Creates a new property listing.
*   **Authentication:** JWT required.
*   **Request Body (Partial IListing):**
    ```json
    {
      "title": "string (required)",
      "description": "string (required)",
      "price": "number (required)",
      "location": {
        "address": "string (required)",
        "city": "string (required)",
        "zipCode": "string (required)"
      },
      "roomType": "'private' | 'shared' | 'entire' | 'studio' (required)",
      "availabilityDate": "Date (ISO string, required)",
      "images": ["string (URL)", "string (URL)"], // Optional, defaults to placeholder
      "bedrooms": "number (optional)",
      "bathrooms": "number (optional)",
      "areaSqFt": "number (optional)",
      "amenities": ["string"], // Optional
      "leaseTerms": "string (optional)",
      "rules": ["string"] // Optional
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Listing created successfully",
      "data": {
        // Full IListing object
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing required fields, validation error.
    *   `401 Unauthorized`: Not authenticated.
    *   `500 Internal Server Error`.

### 3.2. Get All Listings

*   **Endpoint:** `GET /api/listings`
*   **Description:** Retrieves all listings with optional filters and pagination.
*   **Authentication:** Not required (publicly viewable).
*   **Query Parameters (Optional):**
    *   `page`: `number` (default: 1)
    *   `limit`: `number` (default: 10)
    *   `roomType`: `string` (e.g., 'private', 'studio')
    *   `city`: `string` (case-insensitive search)
    *   `minPrice`: `number`
    *   `maxPrice`: `number`
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        // Array of IListing objects (populated createdBy with name, profilePicture, email)
      ],
      "pagination": {
        "currentPage": "number",
        "totalPages": "number",
        "totalListings": "number",
        "limit": "number"
      }
    }
    ```
*   **Error Responses:**
    *   `500 Internal Server Error`.

### 3.3. Get Single Listing by ID

*   **Endpoint:** `GET /api/listings/{id}`
*   **Description:** Retrieves details for a specific listing.
*   **Path Parameters:**
    *   `id`: `ObjectId` (Listing's ID)
*   **Authentication:** Not required.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        // IListing object (populated createdBy)
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid listing ID format.
    *   `404 Not Found`: Listing not found.
    *   `500 Internal Server Error`.

### 3.4. Update Listing

*   **Endpoint:** `PUT /api/listings/{id}`
*   **Description:** Updates an existing listing. User must be the creator.
*   **Path Parameters:**
    *   `id`: `ObjectId` (Listing's ID)
*   **Authentication:** JWT required.
*   **Request Body (Partial IListing, fields to update):**
    *   Similar to create listing, but all fields are optional.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        // Updated IListing object
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid listing ID format, validation error.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: User is not the creator.
    *   `404 Not Found`: Listing not found.
    *   `500 Internal Server Error`.

### 3.5. Delete Listing

*   **Endpoint:** `DELETE /api/listings/{id}`
*   **Description:** Deletes a listing. User must be the creator.
*   **Path Parameters:**
    *   `id`: `ObjectId` (Listing's ID)
*   **Authentication:** JWT required.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Listing deleted successfully"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid listing ID format.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: User is not the creator.
    *   `404 Not Found`: Listing not found.
    *   `500 Internal Server Error`.

---

## 4. Matches (`/api/matches`)

### 4.1. Create Like / Match Action

*   **Endpoint:** `POST /api/matches`
*   **Description:** Records a "like" from the authenticated user to another user. If a mutual like occurs, the match status is updated to 'matched'.
*   **Authentication:** JWT required.
*   **Request Body:**
    ```json
    {
      "likedUserId": "ObjectId (required, ID of the user being liked)"
    }
    ```
*   **Success Responses:**
    *   **201 Created (Pending Like):**
        ```json
        {
          "success": true,
          "message": "Like registered. Waiting for a match.",
          "data": { /* IMatch object with status 'pending' */ },
          "matchStatus": "pending"
        }
        ```
    *   **200 OK (Mutual Match):**
        ```json
        {
          "success": true,
          "message": "It's a match!",
          "data": { /* IMatch object with status 'matched' */ },
          "matchStatus": "matched"
        }
        ```
    *   **200 OK (Already Liked / Matched):**
        ```json
        // If already liked and pending
        { "success": true, "message": "You have already liked this user...", "data": { ... }, "matchStatus": "pending" }
        // If already matched
        { "success": true, "message": "You are already matched with this user", "data": { ... }, "matchStatus": "already_matched" }
        ```
*   **Error Responses:**
    *   `400 Bad Request`: `likedUserId` missing, cannot like yourself.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: Interaction blocked.
    *   `404 Not Found`: `likedUserId` does not correspond to an existing user.
    *   `409 Conflict`: Duplicate like interaction (if unique index is strictly enforced and hit).
    *   `500 Internal Server Error`.

### 4.2. Get User's Matches

*   **Endpoint:** `GET /api/matches`
*   **Description:** Retrieves all 'matched' interactions for the authenticated user.
*   **Authentication:** JWT required.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        // Array of IMatch objects where status is 'matched'.
        // Each object includes populated 'user1' and 'user2' fields,
        // and an 'otherUser' field containing the profile of the matched party.
        // Example item:
        // {
        //   "_id": "ObjectId",
        //   "user1": { "_id": "userId1", "name": "User One", ... },
        //   "user2": { "_id": "userId2", "name": "User Two", ... },
        //   "status": "matched",
        //   "matchedAt": "Date",
        //   "lastMessageAt": "Date",
        //   "otherUser": { "_id": "userId2", "name": "User Two", ... } // if current user is user1
        // }
      ]
    }
    ```
    *Sorted by `lastMessageAt` descending (most recent interaction first).*
*   **Error Responses:**
    *   `401 Unauthorized`: Not authenticated.
    *   `500 Internal Server Error`.

### 4.3. Update Match Status (Unmatch / Block)

*   **Endpoint:** `PUT /api/matches/{id}`
*   **Path Parameters:**
    *   `id`: `ObjectId` (Match ID)
*   **Description:** Allows a user to 'unmatch' or 'block' an interaction.
*   **Authentication:** JWT required. User must be part of the match.
*   **Request Body:**
    ```json
    {
      "status": "'unmatched' | 'blocked' (required)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Match status updated to {newStatus}",
      "data": { /* Updated IMatch object */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid Match ID format, invalid status in body.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: User not part of this match.
    *   `404 Not Found`: Match not found.
    *   `500 Internal Server Error`.

### 4.4. Get Specific Match by ID

*   **Endpoint:** `GET /api/matches/{id}`
*   **Path Parameters:**
    *   `id`: `ObjectId` (Match ID)
*   **Description:** Retrieves details of a specific match.
*   **Authentication:** JWT required. User must be part of the match.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { /* IMatch object with populated user1 and user2 */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid Match ID format.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: User not part of this match.
    *   `404 Not Found`: Match not found.
    *   `500 Internal Server Error`.

---

## 5. Messages (`/api/messages`)

### 5.1. Send Message

*   **Endpoint:** `POST /api/messages`
*   **Description:** Sends a message within a specific conversation (match).
*   **Authentication:** JWT required.
*   **Request Body:**
    ```json
    {
      "conversationId": "ObjectId (required, refers to a Match ID)",
      "text": "string (optional if imageUrl is provided)",
      "imageUrl": "string (URL, optional if text is provided)"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Message sent successfully",
      "data": {
        // IMessage object
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing `conversationId`, or both `text` and `imageUrl` are missing. Invalid ID format.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: User not part of the conversation, or conversation is not 'matched'.
    *   `404 Not Found`: Conversation (match) not found.
    *   `500 Internal Server Error`.

### 5.2. Get Messages for a Conversation

*   **Endpoint:** `GET /api/messages`
*   **Description:** Retrieves messages for a specific conversation, with pagination.
*   **Authentication:** JWT required.
*   **Query Parameters:**
    *   `conversationId`: `ObjectId` (required, Match ID)
    *   `page`: `number` (optional, default: 1)
    *   `limit`: `number` (optional, default: 20)
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        // Array of IMessage objects, sorted chronologically (oldest first).
        // 'sentBy' field is populated with user's name and profilePicture.
      ],
      "pagination": {
        "currentPage": "number",
        "totalPages": "number",
        "totalMessages": "number",
        "limit": "number"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `conversationId` query param missing or invalid format.
    *   `401 Unauthorized`: Not authenticated.
    *   `403 Forbidden`: User not part of the conversation.
    *   `404 Not Found`: Conversation (match) not found.
    *   `500 Internal Server Error`.

---

*This documentation is a brief overview. Refer to the Mongoose schemas (`models/*.ts`) for detailed field information and validation rules.*
