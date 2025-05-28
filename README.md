# Book Review API

A RESTful API for a Book Review System built with Node.js, Express, and MongoDB. This system allows users to manage books and their reviews with authentication and authorization features.

## Features

- User authentication with JWT
- CRUD operations for books
- Add, update, and delete reviews
- Search books by title or author
- Pagination and filtering
- Input validation
- Error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Express Validator for request validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-review.git
   cd book-review
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/book_review
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   ```

4. Start the development server:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Documentation

### Authentication

#### Register a new user
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Books

#### Get all books
```http
GET /api/books?page=1&limit=10&author=John&genre=Fiction
```

#### Search books
```http
GET /api/books/search?q=harry
```

#### Get single book
```http
GET /api/books/:id
```

#### Add a new book (Protected)
```http
POST /api/books
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Classic",
  "publicationYear": 1925
}
```

### Reviews

#### Add a review (Protected)
```http
POST /api/books/:id/reviews
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "A great book!"
}
```

#### Update a review (Protected)
```http
PUT /api/reviews/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review"
}
```

#### Delete a review (Protected)
```http
DELETE /api/reviews/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Database models
├── routes/           # Route definitions
├── services/         # Business logic
├── utils/            # Helper functions
├── server.js         # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Database Schema Design

### Entity Relationship (ER) Diagram

```
+------------------+     +-----------------+     +------------------+
|      Users       |     |      Books      |     |     Reviews      |
+------------------+     +-----------------+     +------------------+
| _id (ObjectId)   |     | _id (ObjectId)  |     | _id (ObjectId)   |
| username         |     | title           |     | bookId           |
| email            |     | author          |     | userId           |
| password         |     | genre           |     | rating           |
| createdAt        |     | publicationYear |     | comment          |
| updatedAt        |     | createdBy       |     | createdAt        |
+------------------+     | averageRating   |     | updatedAt        |
         |               | reviewCount     |     +------------------+
         |               | createdAt       |             |
         |               | updatedAt       |             |
         |               +-----------------+             |
         |                       |                      |
         +---------------------------------------+     |
                     Creates/Owns                |     |
                                                 v     v
                                            Reviews Book
```

### Schema Details

#### User Schema
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, hashed },
  timestamps: true
}
```

#### Book Schema
```javascript
{
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  createdBy: { type: ObjectId, ref: 'User' },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  timestamps: true
}
```

#### Review Schema
```javascript
{
  bookId: { type: ObjectId, ref: 'Book', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 },
  timestamps: true
}
```

## Design Decisions & Assumptions

1. **Authentication & Authorization**
   - JWT-based authentication for secure API access
   - Tokens expire after 24 hours
   - Passwords are hashed using bcrypt

2. **Data Modeling**
   - Books and Reviews are separate collections for better scalability
   - Average rating is stored in the Book document for quick access
   - One review per user per book enforced by unique compound index

3. **Performance Considerations**
   - Pagination implemented for book listings and reviews
   - Indexes on frequently queried fields
   - Caching of average ratings in Book documents

4. **Validation**
   - Input validation using express-validator
   - Custom middleware for route protection
   - Error handling middleware for consistent responses

## Quick Start Guide

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/book-review.git
   cd book-review
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create .env file
   cp .env.example .env

   # Update .env with your values
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/book_review
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB (Windows)
   net start MongoDB

   # Start MongoDB (Linux/Mac)
   sudo service mongod start
   ```

4. **Run the Application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Testing Guide

### Using cURL

1. **Register a User**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

2. **Login & Get Token**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Add a Book**
   ```bash
   # Replace YOUR_TOKEN with the token from login
   curl -X POST http://localhost:3000/api/books \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "title": "The Great Gatsby",
       "author": "F. Scott Fitzgerald",
       "genre": "Classic",
       "publicationYear": 1925
     }'
   ```

4. **Get Books with Filters**
   ```bash
   curl "http://localhost:3000/api/books?page=1&limit=10&genre=Classic"
   ```

5. **Add a Review**
   ```bash
   # Replace YOUR_TOKEN and BOOK_ID
   curl -X POST http://localhost:3000/api/books/BOOK_ID/reviews \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "rating": 5,
       "comment": "A masterpiece!"
     }'
   ```

### Using Postman

1. Import the provided Postman collection:
   - Open Postman
   - Click "Import"
   - Select the `Book-Review-API.postman_collection.json` file

2. Set up environment variables:
   - Create a new environment
   - Add variables:
     - `baseUrl`: `http://localhost:3000`
     - `token`: [Leave empty, will be auto-filled after login]

3. Run the requests in sequence:
   - Register/Login
   - Add Books
   - Add Reviews
   - Test other endpoints

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)