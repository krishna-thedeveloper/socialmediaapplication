import express from "express"
import dotenv from "dotenv"
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import connectMongo from './db/connectMongoDB.js'
import cookies from 'cookie-parser'
const app = express()
dotenv.config()

app.use(express.json())
app.use(cookies())
app.use(express.urlencoded({extended:true}))
app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Backend started at Port : ${process.env.PORT}`)
    connectMongo()
})