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

export const updateUser = async (req, res) => {
  const { fullName, username, email, currentPassword, newPassword, bio, link } = req.body;
  const profileImage = req.files['profileImage'] ? req.files['profileImage'][0] : null;
  const coverImage = req.files['coverImage'] ? req.files['coverImage'][0] : null;
  console.log('enteredupdate', fullName, username);

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Password update logic
    if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
      return res.status(400).json({ error: 'Provide both current and new password' });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Profile image update logic
    if (profileImage) {
      if (user.profileImg) {
        // Delete the old image from Cloudinary
        const publicId = user.profileImg.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      // Upload the new image to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(profileImage.path);
      user.profileImg = uploadedResponse.secure_url;
    }

    // Cover image update logic
    if (coverImage) {
      if (user.coverImg) {
        // Delete the old image from Cloudinary
        const publicId = user.coverImg.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      // Upload the new image to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(coverImage.path);
      user.coverImg = uploadedResponse.secure_url;
    }

    // Update other fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    // Save the updated user
    user = await user.save();
    user.password = null; // Remove password from the response

    console.log('final update');
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};