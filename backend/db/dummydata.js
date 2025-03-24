import mongoose from "mongoose";
import User from "../models/user.model.js"; // Import the User model
import Message from "../models/message.model.js"; // Import the Message model

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://krishna:krish@socialmediaapp.yt2ro.mongodb.net/socialmediaapp?retryWrites=true&w=majority&appName=socialmediaapp";


// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedDatabase();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Function to insert dummy data
async function seedDatabase() {
  try {
    // Clear existing data

   // await Message.deleteMany({});
    //console.log("Cleared existing data");

    // Create dummy users

    console.log("Created dummy users");

    // Create dummy messages
    const messages = [
      {
        sender: "67d868ad205233de45f86f2d",
        receiver: "67d868f7205233de45f86f3f",
        content: "Hello, how are you?",
      },
      {
        sender: "67d868f7205233de45f86f3f",
        receiver: "67d868ad205233de45f86f2d",
        content: "I'm good, thanks! How about you?",
      },
      {
        sender: "67d868ad205233de45f86f2d",
        receiver: "67d868f7205233de45f86f3f",
        content: "Hey, are you coming to the meeting?",
      },
      {
        sender: "67d868f7205233de45f86f3f",
        receiver: "67d868ad205233de45f86f2d",
        content: "Yes, I'll be there!",
      },
    ];

    await Message.insertMany(messages);
    console.log("Created dummy messages");

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.disconnect();
  }
}