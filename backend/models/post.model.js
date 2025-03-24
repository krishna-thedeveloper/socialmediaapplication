import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String
    },
    img: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        // Add timestamps for each comment
        createdAt: {
            type: Date,
            default: Date.now,
            index: -1
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    views: {
        type: String,
        default: '0'
    }
}, { 
    // This adds createdAt and updatedAt timestamps for the main post
    timestamps: true 
});

// Add index for better comment query performance
postSchema.index({ 'comments.createdAt': 1 });

const Post = mongoose.model("Post", postSchema);
export default Post;