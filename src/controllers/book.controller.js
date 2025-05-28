const { validationResult } = require('express-validator');
const Book = require('../models/book.model');
const Review = require('../models/review.model');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const { author, genre } = req.query;
    const filter = {};
    
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (genre) filter.genre = { $regex: genre, $options: 'i' };

    // Query
    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'username'),
      Book.countDocuments(filter)
    ]);

    // Calculate pagination
    const pages = Math.ceil(total / limit);
    const hasNextPage = page < pages;
    const hasPreviousPage = page > 1;

    res.json({
      success: true,
      count: books.length,
      total,
      page,
      pages,
      hasNextPage,
      hasPreviousPage,
      data: books
    });
  } catch (error) {
    console.error('Error in getBooks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search books by title or author
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    })
    .sort({ title: 1 })
    .limit(10);

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error in searchBooks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single book with reviews
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'username'
        },
        options: { sort: { createdAt: -1 } }
      });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error in getBook:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
exports.addBook = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, author, genre, publicationYear } = req.body;

    // Check if book already exists
    let book = await Book.findOne({ title, author });
    
    if (book) {
      return res.status(400).json({ message: 'Book already exists' });
    }

    // Create new book
    book = new Book({
      title,
      author,
      genre,
      publicationYear,
      createdBy: req.user.id
    });

    await book.save();

    // Populate createdBy field
    await book.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error in addBook:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
