const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure a user can only leave one review per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Virtual for user info
reviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'username' }
});

// Update book's average rating after saving a review
reviewSchema.post('save', async function(doc) {
  await this.model('Book').updateRating(doc.bookId);
});

// Update book's average rating after removing a review
reviewSchema.post('remove', async function(doc) {
  await this.model('Book').updateRating(doc.bookId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
