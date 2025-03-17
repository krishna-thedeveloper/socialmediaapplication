// routes/message.route.js
import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
    try {
      const { username } = req.params;
      console.log(username)
      const user = await User.findOne({ username });
      // Fetch messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: user._id,receiver: req.user._id }, // Messages where the user is the sender
        { sender: req.user._id,receiver: user._id }, // Messages where the user is the receiver
      ],
    })
      .populate("sender", "username") // Populate sender details (only username)
      .populate("receiver", "username"); // Populate receiver details (only username)
      console.log(messages)
      console.log("sender:",req.user._id,"receiver:",user._id)
    // Return the messages
    res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  // Send a message
  router.post("/send/:receiverUsername", protectRoute, async (req, res) => {
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
  
  // Fetch messages between two users
  router.get("/:receiverUsername", protectRoute, async (req, res) => {
    try {
      const { receiverUsername } = req.params;
      const senderId = req.user._id;
  
      // Find the receiver by username
      const receiver = await User.findOne({ username: receiverUsername });
      if (!receiver) {
        return res.status(404).json({ error: "Receiver not found" });
      }
  
      // Fetch messages where sender and receiver match
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiver._id },
          { sender: receiver._id, receiver: senderId },
        ],
      }).sort({ timestamp: 1 });
  
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

export default router;