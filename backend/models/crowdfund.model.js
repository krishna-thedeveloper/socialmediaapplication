import mongoose from "mongoose";

const crowdfundSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    goalAmount: {
        type: Number,
        required: true
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    backers: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        amount: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    img: {
        type: String
    },
    status: {
        type: String,
        enum: ["active", "completed", "canceled"],
        default: "active"
    }
}, { timestamps: true });

const Crowdfund = mongoose.model("Crowdfund", crowdfundSchema);
export default Crowdfund;
