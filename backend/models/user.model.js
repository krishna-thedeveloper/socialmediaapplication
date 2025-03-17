import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    fullName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImg:{
        type: String,
        default:""
    },
    coverImg:{
        type: String,
        default:""
    },
    bio:{
        type: String,
        default:""
    },
    link:{
        type: String,
        default:""
    },
    likedPosts:[{
        type:mongoose.Schema.ObjectId,
        ref:'Post',
        default:[]
    }],
    phone: {
        type: String,

    },
    razorpayContactId: {
        type: String,
        default: null, // Initially null, will be updated after linking bank account
    },
    razorpayFundAccountId: {
        type: String,
        default: null, // Initially null, will be updated after linking bank account
    },
    bankLinked: {
        type: Boolean,
        default: false, // Initially false, will be updated to true after linking bank account
    },
},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User;