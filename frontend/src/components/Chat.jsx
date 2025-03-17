// src/components/Chat.js
import React, { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

const Chat = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch message history
    const fetchMessages = async () => {
      const response = await axios.get(`/api/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(response.data);
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId]);

  const sendMessage = () => {
    const messageData = {
      sender: localStorage.getItem("userId"),
      receiver: receiverId,
      content: newMessage,
    };
    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;