import express from "express"
import dotenv from "dotenv"
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import notificationRoutes from './routes/notification.route.js'
import connectMongo from './db/connectMongoDB.js'
import cookies from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'
import cors from 'cors'
import { protectRoute } from "./middleware/protectRoute.js"
import { search } from "./controllers/search.controller.js"
const app = express()
dotenv.config()

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
  }));
app.use(cookies())
app.use(express.urlencoded({extended:true}))
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/notifications',notificationRoutes)
app.get('/api/auth',protectRoute,(req,res)=>{
return res.status(200).json({message:"Authenticated"})
})


app.post('/api/search',protectRoute,search );
  
app.listen(process.env.PORT,()=>{
    console.log(`Backend started at Port : ${process.env.PORT}`)
    connectMongo()
})