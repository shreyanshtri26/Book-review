const express = require('express');
const { check } = require('express-validator');
const bookController = require('../controllers/book.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with pagination and filters
// @access  Public
router.get('/', bookController.getBooks);

// @route   GET /api/books/search
// @desc    Search books by title or author
// @access  Public
router.get('/search', bookController.searchBooks);

// @route   GET /api/books/:id
// @desc    Get single book with reviews
// @access  Public
router.get('/:id', bookController.getBook);

// @route   POST /api/books
// @desc    Add a new book
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('author', 'Author is required').not().isEmpty(),
      check('genre', 'Genre is required').not().isEmpty(),
      check('publicationYear', 'Please include a valid publication year').isInt({
        min: 1000,
        max: new Date().getFullYear()
      })
    ]
  ],
  bookController.addBook
);

module.exports = router;
