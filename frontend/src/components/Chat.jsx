import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/UserContext";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]); // Initialize with empty array
  const [input, setInput] = useState("");
  const { username } = useParams();
  const { user } = useUser();
  const [isSending, setIsSending] = useState(false); // State to track sending animation

  // Fetch message history on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${username}`, {
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error("Expected an array of messages, but got:", response.data);
          setMessages([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]); // Fallback to empty array
      }
    };
    fetchMessages();
  }, [username]);

  // Send message handler
  const sendMessage = async () => {
    if (input.trim() === "") return; // Ignore empty messages

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: {
        _id: user._id,
      }, // Use user ID or fallback to "me"
    };

    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsSending(true); // Trigger animation

    try {
      // Send message to the server
      await axios.post(
        `http://localhost:3000/api/messages/${username}`,
        {
          content: input,
          sender: user._id,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert optimistic update on error
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    } finally {
      setTimeout(() => setIsSending(false), 500); // Reset animation after 500ms
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl lg:max-w-4xl mx-auto border rounded-2xl shadow-lg bg-gray-900 border-gray-700">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-800 border-gray-700 font-semibold text-white flex items-center justify-between">
        <span>Chat with {username}</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender._id === user._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg break-words transform transition-all duration-200 ${
                msg.sender._id === user._id
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {msg.text || msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t flex items-center gap-2 bg-gray-800 border-gray-700">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-700 border-gray-600 text-white focus:ring-blue-600 transition-all duration-200"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          aria-label="Type a message"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200 relative"
          onClick={sendMessage}
          aria-label="Send message"
        >
          <PaperAirplaneIcon
            className={`h-5 w-5 transform rotate-90 ${
              isSending ? "animate-fly" : ""
            }`}
          />
        </button>
      </div>

      {/* CSS for Animation */}
      <style>
        {`
          @keyframes fly {
            0% {
              transform: rotate(90deg) translateX(0);
              opacity: 1;
            }
            50% {
              transform: rotate(90deg) translateX(20px);
              opacity: 0.5;
            }
            100% {
              transform: rotate(90deg) translateX(40px);
              opacity: 0;
            }
          }
          .animate-fly {
            animation: fly 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}