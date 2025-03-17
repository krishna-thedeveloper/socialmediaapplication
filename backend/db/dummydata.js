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

    await Message.deleteMany({});
    console.log("Cleared existing data");

    // Create dummy users
    const user1 = await User.create({
      username: "krish",
      email: "krish@gmail.com",
      password: "password123", // In a real app, hash the password!
      fullName:"alice"
    });

    const user2 = await User.create({
     fullName:"bob",
      username: "bob",
      email: "bob@example.com",
      password: "password123", // In a real app, hash the password!
    });

    const user3 = await User.create({
      username: "charlie",
      email: "charlie@example.com",
      password: "password123", // In a real app, hash the password!
    });

    console.log("Created dummy users");

    // Create dummy messages
    const messages = [
      {
        sender: user1._id,
        receiver: user2._id,
        content: "Hey Bob, how are you?",
      },
      {
        sender: user2._id,
        receiver: user1._id,
        content: "I'm good, thanks! How about you?",
      },
      {
        sender: user1._id,
        receiver: user3._id,
        content: "Hi Charlie, are you coming to the meeting?",
      },
      {
        sender: user3._id,
        receiver: user1._id,
        content: "Yes, I'll be there!",
      },
      {
        sender: user2._id,
        receiver: user3._id,
        content: "Charlie, can you send me the report?",
      },
      {
        sender: user3._id,
        receiver: user2._id,
        content: "Sure, I'll email it to you.",
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