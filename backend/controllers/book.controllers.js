import Book from '../models/book.models.js';
import { getUserReviews } from './user.controllers.js';

// Controller to create a new book
export const createBook = async (req, res) => {
  try {
    const { title, price, author, description, genre, publishedDate, pageCount, coverImageURL } = req.body;

    const newBook = new Book({
      title,
      price,
      author,
      description,
      genre,
      publishedDate,
      pageCount,
      coverImageURL,
    });

    await newBook.save();

    res.status(201).json({
      message: 'Book created successfully',
      book: newBook,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create book',
      error: error.message,
    });
  }
};
// Controller to fetch all books
export const getAllBooks = async (req, res) => {
    try {
      const books = await Book.find({});
  
      res.status(200).json({
        message: 'Books fetched successfully',
        books,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch books',
        error: error.message,
      });
    }
  };
 // Controller to fetch a book by ID
export const getBookById = async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await Book.findById(bookId)
        .populate('addedBy', 'username email')
        .populate('reviews.userId', 'username email');
  
      if (!book) {
        return res.status(404).json({
          message: 'Book not found',
        });
      }
  
      res.status(200).json({
        message: 'Book fetched successfully',
        book,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch book',
        error: error.message,
      });
    }
  };
   // Controller to update a book by ID
export const updateBook = async (req, res) => {
    try {
      const bookId = req.params.id;
      const { title, price, author, description, genre, publishedDate, pageCount, coverImageURL } = req.body;
  
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { title, price, author, description, genre, publishedDate, pageCount, coverImageURL, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
  
      if (!updatedBook) {
        return res.status(404).json({
          message: 'Book not found',
        });
      }
  
      res.status(200).json({
        message: 'Book updated successfully',
        book: updatedBook,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update book',
        error: error.message,
      });
    }
  };
  // Controller to delete a book by ID
export const deleteBook = async (req, res) => {
    try {
      const bookId = req.params.id;
  
      const deletedBook = await Book.findByIdAndDelete(bookId);
  
      if (!deletedBook) {
        return res.status(404).json({
          message: 'Book not found',
        });
      }
  
      res.status(200).json({
        message: 'Book deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete book',
        error: error.message,
      });
    }
  };
  export const getReview = async(req,res)=>{
    try {
      const {bookId,reviewId} = req.params
      const book = await Book.findById(bookId)
      const review = book.reviews.find((review)=>review._id == reviewId)
      console.log(review)
      if(!review){
        res.status(404).json({message:"no review found",})
      }
      res.status(200).json(review)
    } catch (error) {
      res.status(400).json({message:"internal server error",err:error.message})
    }
  }
export const getReviews = async(req,res)=>{
try {
  const bookId = req.params.id
  const book = await Book.findById(bookId)
  const reviews = book.reviews
  if(!reviews){
    res.status(200).json({message: "no reviews available for this book"})
  }
  res.status(200).json({message:"reviews fetched successfully",reviews})
}  
 catch (error) {
 res.status(400).json({message:"internal serever error",err:error.message}) 
}
}
  // Controller to add a review to a book

export const addReview = async (req, res) => {
    try {
      const bookId = req.params.id;
      const { comment, rating } = req.body;
      const userId = req.user._id;
  
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({
          message: 'Book not found',
        });
      }
  
  
      book.reviews.push({
        userId,
        comment,
        rating,
      });
  
    
      const totalReviews = book.reviews.length;
      const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
      book.ratings.average = totalRating / totalReviews;
      book.ratings.count = totalReviews;
  
      await book.save();
  
      res.status(201).json({
        message: 'Review added successfully',
        book,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to add review',
        error: error.message,
      });
    }
  };
  // Controller to update a review
export const updateReview = async (req, res) => {
    try {
      const bookId = req.params.bookId;
      const reviewId = req.params.reviewId;
      const { comment, rating } = req.body;
  
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const review = book.reviews.id(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      review.comment = comment;
      review.rating = rating;
  
      // Recalculate the average rating
      const totalReviews = book.reviews.length;
      const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
      book.ratings.average = totalRating / totalReviews;
  
      await book.save();
  
      res.status(200).json({
        message: 'Review updated successfully',
        book,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update review',
        error: error.message,
      });
    }
  };
  // Controller to delete a review
// Controller to delete a review
export const deleteReview = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find the index of the review
    const reviewIndex = book.reviews.findIndex((review) => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Remove the review from the array
    book.reviews.splice(reviewIndex, 1);

    // Recalculate the average rating
    const totalReviews = book.reviews.length;
    const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
    book.ratings.average = totalReviews > 0 ? totalRating / totalReviews : 0;

    await book.save();

    res.status(200).json({
      message: 'Review deleted successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};
export const getBooksByGenre = async (req, res) => {
  try {
    const { genre } = req.body; 
    const books = await Book.find({ genre: { $in: [genre] } }); 
    console.log(genre)
    if (books.length === 0) {
      return res.status(404).json({
        message: 'No books found for the specified genre',
      });
    }

    res.status(200).json({
      message: 'Books fetched successfully',
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch books by genre',
      error: error.message,
    });
  }
};

