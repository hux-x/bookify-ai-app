import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price:{
    type: Number,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  genre: {
    type: [String],
    required: true
  },
  publishedDate: {
    type: String,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  coverImageURL: {
    type: String,
    trim: true,
    required:true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      comment: {
        type: String,
        trim: true
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
