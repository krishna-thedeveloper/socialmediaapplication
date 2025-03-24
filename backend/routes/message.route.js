// routes/message.route.js
import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/messaged", async (req, res) => {
  const currentUserId = req.user._id; // Assuming you have authentication middleware
  try {
    // Find all unique users who have exchanged messages with the current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).populate("sender receiver", "fullName username profileImg");

    // Extract unique users
    const usersMap = new Map(); // Use a Map to deduplicate by _id
    messages.forEach((message) => {
      // Check sender
      if (
        message.sender &&
        message.sender._id.toString() !== currentUserId.toString()
      ) {
        usersMap.set(message.sender._id.toString(), message.sender);
      }

      // Check receiver
      if (
        message.receiver &&
        message.receiver._id.toString() !== currentUserId.toString()
      ) {
        usersMap.set(message.receiver._id.toString(), message.receiver);
      }
    });

    // Convert Map values to an array
    const users = Array.from(usersMap.values());
    console.log("final", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch users with messages:", error);
    res.status(500).json({ message: "Failed to fetch users with messages" });
  }
});
router.get("/:username", async (req, res) => {
    try {
      const { username } = req.params;
      console.log(username)
      const user = await User.findOne({ username });
      // Fetch messages where the user is either the sender or receiver
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
    const messages = await Message.find({
      $or: [
        { sender: user._id,receiver: req.user._id }, // Messages where the user is the sender
        { sender: req.user._id,receiver: user._id }, // Messages where the user is the receiver
      ],
    })
      .populate("sender", "username") // Populate sender details (only username)
      .populate("receiver", "username"); // Populate receiver details (only username)

    // Return the messages
    res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  // Send a message
  router.post("/:receiverUsername", protectRoute, async (req, res) => {
    try {
      const { content } = req.body;
      const { receiverUsername } = req.params;
      const senderId = req.user._id;
  
      // Find the receiver by username
      const receiver = await User.findOne({ username: receiverUsername });
      if (!receiver) {
        return res.status(404).json({ error: "Receiver not found" });
      }
  
      // Create and save the message
      const newMessage = new Message({ sender: senderId, receiver: receiver._id, content });
      await newMessage.save();
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  


export default router;