import User from '../models/user.model.js'

export const getUserProfile = async (req,res)=>{
    const {username} = req.params
    try{
        const user = User.findOne({username}).select("-password")
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.status(200).json(user)
    }catch(error){
        console.log(error.message)
        res.status(500).json({error:"Internal server error"})
    }
}

export  const followunfollowuser = async (req,res)=>{
    try{
        const {id}=req.params
        const userTomodify = await User.findById(id)
        const currentUser = await User.findById(req.user._id);
        if(id==req.user._id.toString()){
            return res.status(400).json({error:"you can't follow or unfollow yourself"})
        }
        if(!userTomodify || !currentUser){
            return res.status(400).json({error:"user not found"})
        }
        const isFollowing = currentUser.following.includes(id)
        if(isFollowing){
            await User.findByIdAndUpdate(id,{ $pull :{followers:currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id,{ $pull :{following:id}})
            return res.status(200).json({message:"unfollowed successfully !"})
        }else{
            await User.findByIdAndUpdate(id,{ $push :{followers:currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id,{ $push :{following:id}})

            const newNotification = new Notification({
                type:'follow',
                from:currentUser._id,
                to:id
            })
            await  newNotification.save()
            return res.status(200).json({message:"followed successfully !"})
        }
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}