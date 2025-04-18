import express from 'express';

import { 
  createBook, 
  getAllBooks, 
  getBookById, 
  updateBook, 
  deleteBook, 
  addReview, 
  updateReview, 
  deleteReview,
  getReview,
  getReviews,
  getBooksByGenre
} from '../controllers/book.controllers.js';
import auth from '../middlewares/auth.js'
const router = express.Router();

// Book Routes
router.post('/add', createBook); // Create a new book
router.get('/', getAllBooks); // Fetch all books
router.get('/:id', getBookById); // Fetch a book by ID
router.put('/:id', updateBook); // Update a book by ID
router.delete('/:id', deleteBook); // Delete a book by ID
router.post('/filter', getBooksByGenre);

// Review Routes
router.post('/:id/reviews',auth, addReview); // Add a review to a book
router.put('/:bookId/reviews/:reviewId', auth, updateReview); // Update a review
router.delete('/:bookId/reviews/:reviewId',auth, deleteReview); // Delete a review
router.get('/:bookId/reviews/:reviewId', getReview); 
router.get('/:id/reviews',auth, getReviews);




export default router;
