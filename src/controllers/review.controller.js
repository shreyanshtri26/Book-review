const { validationResult } = require('express-validator');
const Book = require('../models/book.model');
const Review = require('../models/review.model');

// @desc    Add a review
// @route   POST /api/books/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      bookId: book._id,
      userId: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this book' 
      });
    }

    // Create new review
    const review = new Review({
      bookId: book._id,
      userId: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await review.save();

    // Update book's average rating
    const reviews = await Review.find({ bookId: book._id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    book.averageRating = totalRating / reviews.length;
    book.reviewCount = reviews.length;
    await book.save();

    // Populate user info
    await review.populate('user', 'username');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in addReview:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rating, comment } = req.body;

    // Find the review
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the review belongs to the user
    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ 
        message: 'Not authorized to update this review' 
      });
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    // Populate user info
    await review.populate('user', 'username');

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in updateReview:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the review belongs to the user
    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ 
        message: 'Not authorized to delete this review' 
      });
    }

    // Find and delete the review (replacing deprecated remove() method)
    await Review.deleteOne({ _id: req.params.id });
    
    // Update book's average rating after review deletion
    const book = await Book.findById(review.bookId);
    if (book) {
      const reviews = await Review.find({ bookId: book._id });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        book.averageRating = totalRating / reviews.length;
      } else {
        book.averageRating = 0;
      }
      
      book.reviewCount = reviews.length;
      await book.save();
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
