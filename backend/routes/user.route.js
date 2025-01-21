import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile,getSugguetedUsers,followunfollowuser,updateUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/profile/:username',protectRoute,getUserProfile)
router.get('/sugguested',protectRoute,getSugguetedUsers)
router.get('/follow/:username',protectRoute,followunfollowuser)
router.post('/update',protectRoute,updateUser)
export default router;