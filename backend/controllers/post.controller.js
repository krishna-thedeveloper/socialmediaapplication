import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"; // Import the file system module


export const createPost = async (req, res) => {
  try {
    const { text } = req.body; // Access text from req.body
    const userId = req.user._id.toString(); // Access user ID from req.user
    const imageFile = req.file; // Access uploaded file from req.file

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate post content
    if (!text && !imageFile) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    let imageUrl;
    if (imageFile) {
      // Upload image to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "posts", // Optional: Organize images in a folder
      });
      imageUrl = uploadedResponse.secure_url; // Get the URL of the uploaded image

      // Delete the temporary file after upload
      fs.unlinkSync(imageFile.path);
    }

    // Create and save the new post
    const newPost = new Post({
      user: userId,
      text,
      img: imageUrl, // Save the Cloudinary URL
    });
    await newPost.save();

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deletePost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"you are unauthorized"})
        }
        if(post.img){
            const imgid = post.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imgid)
        }
        await Post.findByIdAndDelete(req.params.id)

        return res.status(200).json({message:"post deleted successfully !"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const commentPost = async (req,res)=>{
    try{
        const {text}=req.body
        const postId = req.params.id
        const userId = req.user._id
        if(!text){
            return res.status(400).json({error:"text field required"})
        }
        const post =await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const comment = {
            user:userId,
            text
        }
        post.comments.push(comment)
        await post.save()

        const newNotification = new Notification({
            type:'comment',
            from:userId,
            text,
            to:post.user
        })
        await  newNotification.save()

        return res.status(200).json(post)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}
export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Find post and sort comments by createdAt in descending order (newest first)
        const post = await Post.findById(postId)
            .populate({
                path: "comments.user",
                select: "username profileImg createdAt" // Only include necessary fields
            })
            .sort({ 'comments.createdAt': -1 }); // Sort comments by newest first

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Client-side sorting as fallback (in case the DB sort didn't work)
        const sortedComments = post.comments.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return res.status(200).json({
            comments: sortedComments,
            numberOfComments: sortedComments.length
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

export const likeUnlikePost = async (req,res)=>{
    try{
        const postId = req.params.id
        const userId = req.user._id

        const post =await Post.findById(postId)
        let numberOfLikes = post.likes.length
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const user = await User.findById(userId)
        if(!user)   return res.status(404).json({error:"user not found"})
        const isLiked = post.likes.includes(userId)
        if(isLiked){
            await Post.findByIdAndUpdate(postId,{ $pull :{likes:userId}})
            await User.findByIdAndUpdate(userId,{ $pull :{likedPosts:postId}})
            //await User.updateOne({userId},{$pull:{$likedPosts:postId}})
            numberOfLikes -=1
            return res.status(200).json({numberOfLikes,isLiked:false})
        }else{
            await Post.findByIdAndUpdate(postId,{ $push :{likes:userId}})
            await User.findByIdAndUpdate(userId,{ $push :{likedPosts:postId}})
            //await User.updateOne({userId},{$push:{$likedPosts:postId}})
            const newNotification = new Notification({
                type:'like',
                from:user._id,
                to:post.user
            })
            await  newNotification.save()
            numberOfLikes +=1
            return res.status(200).json({numberOfLikes,isLiked:true})
        }
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const getAllPosts = async (req,res)=>{
    try{
        const posts = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password -email"
        })
        if(posts.length==0){
            return res.status(200).json([])
        }
        return res.status(200).json(posts)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const getLikedPosts = async(req,res)=>{
    const userId = req.params.id
    try{
        const user = await User.findById(userId)
        if(!user)   return res.status(404).json({error:"user not found"})
        
        const likedPosts = await Post.find({_id:{$in:user.likedPosts}}).populate({
            path:"user",
            select:"-password -email"
        })
        return res.status(200).json(likedPosts)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const getFollowingPosts = async (req,res)=>{
    try{
        const userId = req.user._id
        const user = await User.findById(userId).select("following")
        if(!user)   return res.status(404).json({error:"user not found"})
        const followingPosts = await Post.find({user:{$in:user.following}}).populate({
        path:"user",
        select:"-password -email"
        })
        return res.status(200).json(followingPosts)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const getUserPosts = async (req,res)=>{
    try{
        const username = req.params.username
        const user = await User.findOne({username})
        if(!user)   return res.status(404).json({error:"user not found"})
        const posts = await Post.find({user:user._id}).populate({
        path:"user",
        select:"-password -email"
        })
        return res.status(200).json(posts)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id; // From authentication middleware

        // Find the post containing the comment
        const post = await Post.findOne({
            _id: postId,
            'comments._id': commentId,
            'comments.user': userId // Ensure comment belongs to requesting user
        });

        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: "Comment not found or unauthorized" 
            });
        }

        // Remove the comment
        await Post.findByIdAndUpdate(
            postId,
            {
                $pull: { 
                    comments: { 
                        _id: commentId,
                        user: userId 
                    } 
                }
            }
        );

        // Get updated comment count
        const updatedPost = await Post.findById(postId);
        const commentCount = updatedPost.comments.length;

        res.status(200).json({ 
            success: true,
            commentCount,
            message: "Comment deleted successfully" 
        });

    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete comment" 
        });
    }
};


