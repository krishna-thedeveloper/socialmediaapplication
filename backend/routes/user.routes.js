import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile,followunfollowuser } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/profile/:username',protectRoute,getUserProfile)
//router.get('/sugguested',protectRoute,getSugguetedProfiles)
router.get('/follow/:id',protectRoute,followunfollowuser)
//router.get('/update',protectRoute,updateUserProfile)
export default router;