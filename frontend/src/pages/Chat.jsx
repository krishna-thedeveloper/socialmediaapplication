import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How's it going?", sender: "other" },
    { id: 2, text: "I'm good! How about you?", sender: "me" },
  ]);
  const [input, setInput] = useState("");
  const { username } = useParams();

  useEffect(() => {
    // Fetch message history
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${username}`, {
          withCredentials:true
        });
        // Ensure messages is an array
        /*
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error("Expected an array of messages, but got:", response.data);
          setMessages([]); // Fallback to empty array
        }*/
       console.log(response)
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]); // Fallback to empty array
      }
    };
    fetchMessages();

    // Listen for incoming messages
    /*
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receiveMessage");
    };*/
  }, [username]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: "me" }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border rounded-2xl shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-100 dark:bg-gray-700 dark:border-gray-600 font-semibold dark:text-white">
        Chat
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === "me" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 dark:bg-gray-600 dark:text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t flex items-center gap-2 bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}