import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import crowdfundRoutes from './routes/crowdfund.route.js';
import razorpaywebhooks from "./routes/razorpaywebhook.route.js";
import messageRoutes from './routes/message.route.js';
import connectMongo from './db/connectMongoDB.js';
import cookies from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import { protectRoute } from "./middleware/protectRoute.js";
import { search } from "./controllers/search.controller.js";
import reportRoutes from './routes/report.route.js';
import { linkBankAccount } from "./controllers/crowdfund.controller.js";
import Message from "./models/message.model.js";

const app = express();
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(cookies());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/crowdfunds", protectRoute, crowdfundRoutes);
app.use("/api/razorpay-webhook", razorpaywebhooks);
app.get('/api/auth', protectRoute, (req, res) => {
  return res.status(200).json(req.user);
});
app.use("/api/reports", reportRoutes);
app.post('/api/search', protectRoute, search);
app.post("/api/user/link-bank", protectRoute, linkBankAccount);
app.use('/api/messages', protectRoute, messageRoutes);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.userId = decoded.id; // Attach the user ID to the socket
    next();
  });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.userId);

  // Join a room for the user
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Listen for new messages
  socket.on("sendMessage", async (data) => {
    const { receiver, content } = data;
    const sender = socket.userId;

    // Save message to MongoDB
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();

    // Emit the message to the receiver
    io.to(receiver).emit("receiveMessage", newMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Backend started at Port : ${process.env.PORT}`);
  connectMongo();
});