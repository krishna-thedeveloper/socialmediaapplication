import express from 'express'
import {signup,login,logout,getme} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'
const authRouter = express.Router()

authRouter.post('/signup',signup)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.get('/me',protectRoute,getme)
export default authRouter;