import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; // For resolving __dirname in ES Modules
import { handleImagePrompts, handleReviewPrompts } from '../controllers/ai.controllers.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '../public/uploads'); 
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});


const upload = multer({ storage: storage });
const uploadImageMiddleware = upload.single('image');

router.post('/processImage', uploadImageMiddleware, handleImagePrompts);
router.post('/processReviews',handleReviewPrompts)

export default router;

