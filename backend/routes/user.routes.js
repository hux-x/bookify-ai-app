import express from 'express';
import {
  registerUser,
  loginUser,
  getUserDetails,
  updateUser,
  deleteUser,
  getUserPersonalInfo,
  getUserReviews,
  getUserReadingList,
  updatePersonalInfo,
  updateReadingList,
  deleteReview,
  addCurrentlyReading,
  getCurrentlyReading
} from '../controllers/user.controllers.js';
import auth from '../middlewares/auth.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/me', auth, getUserDetails)
router.put('/me', auth, updateUser);
router.delete('/me', auth, deleteUser);

router.get('/info/:id', getUserPersonalInfo); 
router.put('/personal-info', auth, updatePersonalInfo);


router.get('/reviews', getUserReviews);
router.delete('/reviews', auth, deleteReview); 


router.get('/reading-list',auth, getUserReadingList);
router.put('/reading-list', auth, updateReadingList); 

router.post('/currently-reading', auth,addCurrentlyReading);
router.get('/currently-reading',auth, getCurrentlyReading);

export default router;
