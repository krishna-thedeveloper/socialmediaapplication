import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  ],
  lastInteraction: {
    type: Date,
    default: Date.now, // Timestamp of the last message
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Reference to the Message model
    },
  ],
});

// Update lastInteraction whenever a new message is added
chatSchema.methods.addMessage = async function (messageId) {
  this.messages.push(messageId); // Add the message to the chat
  this.lastInteraction = new Date(); // Update the lastInteraction timestamp
  await this.save(); // Save the updated chat
};

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;