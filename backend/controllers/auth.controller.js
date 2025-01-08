import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
export const signup = async (req,res)=>{
    try{
        const {fullName,username,email,password} = req.body;
        const emailRegex = /^\S+@\S+\.\S+$/
        
        if(!emailRegex.test(email)){
            return res.status(400).json({"error":"Invalid email format"})
        }
        const existingUsername = await User.findOne({username})
        if(existingUsername){
            return res.status(400).json({"error":"Username is already taken"})
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({"error":"email already exists"})
        }
        if(password<6){
            return res.status(400).json({"error":"password must be atleat 6 characters long"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        
        const newUser = new User({
            fullName,username,email,password : hashedPassword
        })
        
        if(newUser){
            
            generateTokenAndSetCookie(newUser._id,res)
            
        
            await newUser.save()
            console.log("hbjhv")
            res.status(201).json({message:"user created successfully"})
        }else{
            res.status(400).json({"error":"Invalid user data"})
        }
    }catch(error){
        console.log(error.message)
        res.status(500).json({"error":"Internal server error !"})
    }
}

export const login = async (req,res)=>{
    try{
        const {username,password} = req.body;

        
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")
        if(!user || !isPasswordCorrect){
            return res.status(400).json({"error":"Invalid Username or password"})
        }
        generateTokenAndSetCookie(user._id,res)
        res.status(200).json({
            id:user._id,
            message:"Login success !"
        })
    }catch(error){
        console.log(error.message)
        res.status(500).json({"error":"Internal server error !"})

    }
}

export const logout = async (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({
            message:"Logout success"
        })
    }catch(error){
        console.log(error.message)
        res.status(500).json({"error":"Internal server error !"})

    }
}


export const getme = async (req,res)=>{
    try{

        res.status(200).json({
            ...req.user,
            message:"get me"
        })
    }catch(error){
        console.log(error.message)
        res.status(500).json({"error":"Internal server error !"})

    }
}