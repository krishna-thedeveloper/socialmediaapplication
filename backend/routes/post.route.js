import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {createPost,deletePost,commentPost,getPostComments,likeUnlikePost,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts} from '../controllers/post.controller.js'

const router = express.Router();

router.post('/create',protectRoute,createPost)
router.get('/all',protectRoute,getAllPosts)
router.get('/user/:username',protectRoute,getUserPosts)
router.get('/following',protectRoute,getFollowingPosts)
router.get('/likes/:id',protectRoute,getLikedPosts)
router.post('/like/:id',protectRoute,likeUnlikePost)
router.post('/comment/:id',protectRoute,commentPost)
router.get('/comment/:id',protectRoute,getPostComments)
router.delete('/:id',protectRoute,deletePost)
export default router;