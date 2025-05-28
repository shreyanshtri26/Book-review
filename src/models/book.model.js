const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  publicationYear: {
    type: Number,
    min: [1000, 'Publication year must be a valid year'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookId'
});

// Update the average rating and review count when reviews are added/updated/deleted
bookSchema.statics.updateRating = async function(bookId) {
  const result = await this.model('Review').aggregate([
    { $match: { bookId: bookId } },
    {
      $group: {
        _id: '$bookId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await this.findByIdAndUpdate(bookId, {
      averageRating: parseFloat(result[0].averageRating.toFixed(1)),
      reviewCount: result[0].reviewCount
    });
  } else {
    await this.findByIdAndUpdate(bookId, {
      averageRating: 0,
      reviewCount: 0
    });
  }
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
