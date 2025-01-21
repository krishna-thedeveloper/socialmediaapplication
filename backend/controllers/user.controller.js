import User from '../models/user.model.js'
import Notification from '../models/notification.model.js'
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'

export const getUserProfile = async (req,res)=>{
    const {username} = req.params
    try{
        const user = await User.findOne({username}).select("-password")
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        return res.status(200).json({
            "username":user.username,
            "followers":user.followers,
            "following":user.following,
            "fullName":user.fullName,
            "profileImg":user.profileImg,
            "coverImg":user.coverImg
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export  const followunfollowuser = async (req,res)=>{
    try{
        const {username}=req.params
        const userToModify = await User.findOne({username})
        const currentUser = await User.findById(req.user._id);
        if(userToModify._id==req.user._id.toString()){
            return res.status(400).json({error:"you can't follow or unfollow yourself"})
        }
        if(!userToModify || !currentUser){
            return res.status(404).json({error:"user not found"})
        }
        const isFollowing = currentUser.following.includes(userToModify._id)
        if(isFollowing){
            await User.findByIdAndUpdate(userToModify._id,{ $pull :{followers:currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id,{ $pull :{following:userToModify._id}})
            return res.status(200).json({message:"unfollowed successfully !"})
        }else{
            await User.findByIdAndUpdate(userToModify._id,{ $push :{followers:currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id,{ $push :{following:userToModify._id}})

            const newNotification = new Notification({
                type:'follow',
                from:currentUser._id,
                to:userToModify._id
            })
            await  newNotification.save()
            return res.status(200).json({message:"followed successfully !"})
        }
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const  getSugguetedUsers = async(req,res)=>{
    try{
        const userId = req.user._id
        const usersFollowedByMe = await User.findById(userId).select("following")
        const users = await User.aggregate([{
            $match:{
                _id:{$ne:userId}
            }},{$sample:{size:10}}
        ])
        const filteredUsers = users.filter(user=>!usersFollowedByMe.following.includes(user._id))
        const sugguestedUsers= filteredUsers.slice(0,4) 
        sugguestedUsers.forEach(user => user.password=null)
        return res.status(200).json(sugguestedUsers)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const updateUser = async (req,res)=>{
    const {fullName,username,email,currentPassword,newPassword,bio,link}=req.body
    let {profileImg,coverImg}=req.body
    
    const userId = req.user._id
    try{
        let user = await User.findById(userId)
        if(!user) return res.status(404).json({error:"user not found"})
        
        if((!newPassword && currentPassword) || (newPassword && !currentPassword)){
            return res.status(404).json({error:"provide both new and currenr password"})
        }
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password)

            if(!isMatch){
                return res.status(404).json({error:"current password is incorrect"})
            }
            if(newPassword.length<6) return res.status(404).json({error:"provide password greater than 6 characters"})

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword,salt)
}
            
            if(profileImg){
                if(user.profileImg){
                    await cloudinary.uploader.destroy(user.profileImg.split('/')).pop().split('.')[0]
                }
                const uploadedResponse = await cloudinary.uploader.upload(profileImg)
                profileImg = uploadedResponse.secure_url
            }
            if(coverImg){
                if(user.coverImg){
                    await cloudinary.uploader.destroy(user.coverImg.split('/')).pop().split('.')[0]
                }
                const uploadedResponse = await cloudinary.uploader.upload(coverImg)
                coverImg = uploadedResponse.secure_url
            }

            user.fullName = fullName || user.fullName
            user.email = email || user.email
            user.username = username || user.username
            user.bio = bio || user.bio
            user.link = link || user.link
            user.profileImg = profileImg || user.profileImg
            user.coverImg = coverImg || user.coverImg

            user = await user.save()
            user.password = null
            return res.status(200).json(user)
        
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}