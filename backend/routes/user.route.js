import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile,getSugguetedUsers,followunfollowuser,updateUser } from '../controllers/user.controller.js';
import multer from 'multer'
import path from 'path'

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  },
});
const upload = multer({ storage });
const router = express.Router();

router.get('/profile/:username',protectRoute,getUserProfile)
router.get('/sugguested',protectRoute,getSugguetedUsers)
router.get('/follow/:username',protectRoute,followunfollowuser)
router.put('/update',upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),protectRoute,updateUser)
export default router;