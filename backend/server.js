const express = require('express')
const dotenv = require('dotenv')
const authRouter = require('./routes/auth.route')
app = express()
dotenv.configDotenv()
app.use('/api/auth',authRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Backend started at Port : ${process.env.PORT}`)
})