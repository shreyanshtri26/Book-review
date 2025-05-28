const express = require('express');
const { check } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// @route   POST /api/books/:id/reviews
// @desc    Add a review to a book
// @access  Private
router.post(
  '/books/:id/reviews',
  [
    auth,
    [
      check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
      check('comment', 'Comment must be less than 1000 characters').optional().isLength({ max: 1000 })
    ]
  ],
  reviewController.addReview
);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
      check('comment', 'Comment must be less than 1000 characters').optional().isLength({ max: 1000 })
    ]
  ],
  reviewController.updateReview
);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
