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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)