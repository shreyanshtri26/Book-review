# Book Review API

A RESTful API for a Book Review System built with Node.js, Express, and MongoDB that allows users to manage books and their reviews with JWT authentication.

## Project Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/yourusername/book-review.git
   cd book-review
   npm install
   ```

2. **Environment Configuration**
   - Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/book_review
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   ```

## How to Run Locally

1. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB

   # Linux/Mac
   sudo service mongod start
   ```

2. **Launch the Application**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

3. **Access the API**
   - The API will be available at `http://localhost:3000`
   - Use the health check endpoint to verify: `GET http://localhost:3000/health`

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers (handle requests)
├── middleware/       # Authentication & validation middleware
├── models/           # Database models/schemas
├── routes/           # API route definitions
├── server.js         # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate and get JWT token
- `GET /api/auth/me` - Get current user (protected)

### Books
- `GET /api/books` - Get all books (with pagination & filters)
- `GET /api/books/:id` - Get book details including reviews
- `POST /api/books` - Add a new book (protected)
- `GET /api/books/search` - Search books by title or author

### Reviews
- `POST /api/books/:id/reviews` - Add a review (protected)
- `PUT /api/books/reviews/:id` - Update a review (protected)
- `DELETE /api/books/reviews/:id` - Delete a review (protected)

## Example API Requests

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

3. **Add a Book (Authenticated)**
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

5. **Add a Review (Authenticated)**
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

1. **Import Collection**
   - Collection file: `Book-Review-API.postman_collection.json`
   - Set environment variable `baseUrl` to `http://localhost:3000`
   - The login request automatically sets the token for other requests

## Design Decisions & Assumptions

1. **Authentication Strategy**
   - JWT-based authentication with 24-hour token expiry
   - Passwords hashed using bcrypt for security
   - Protected routes require valid token in Authorization header

2. **Data Modeling Decisions**
   - One user can create multiple books and reviews
   - One book can have many reviews but only one per user
   - Average rating calculated and cached in the book document

3. **API Design**
   - RESTful principles with resource-based URLs
   - Consistent error responses with appropriate status codes
   - Pagination for collections to improve performance

4. **Performance Optimizations**
   - Indexed fields for faster querying (title, author, userId, bookId)
   - Caching average ratings in the book document
   - Efficient validation using express-validator

## Database Schema

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

### Schema Definitions

```javascript
// User Schema
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timestamps: true
}

// Book Schema
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

// Review Schema
{
  bookId: { type: ObjectId, ref: 'Book', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 },
  timestamps: true
}