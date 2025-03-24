import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/UserContext";

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    let date;
    if (timestamp.$date?.$numberLong) {
      date = new Date(parseInt(timestamp.$date.$numberLong));
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return '';
    }
    
    return isNaN(date.getTime()) 
      ? '' 
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { username } = useParams();
  const { user: currentUser } = useUser();
  const [isSending, setIsSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch users who have exchanged messages with the current user
  useEffect(() => {
    const fetchMessagedUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/messages/messaged", {
          withCredentials: true,
        });
        setUsers(response.data);
        
        if (username) {
          const matchedUser = response.data.find(u => u.username === username);
          setSelectedUser(matchedUser || null);
        }
      } catch (error) {
        console.error("Failed to fetch messaged users:", error);
      }
    };
    fetchMessagedUsers();
  }, [username]);

  // Fetch message history when username changes
  useEffect(() => {
    if (!username) {
      setMessages([]);
      setSelectedUser(null);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${username}`, {
          withCredentials: true,
        });
        
        const processedMessages = Array.isArray(response.data) 
          ? response.data.map(msg => ({
              ...msg,
              sender: msg.sender || { _id: currentUser._id },
              receiver: msg.receiver || { _id: selectedUser?._id },
              timestamp: msg.timestamp || { $date: { $numberLong: Date.now().toString() } }
            }))
          : [];
        setMessages(processedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [username, currentUser._id, selectedUser?._id]);

  const sendMessage = async () => {
    if (input.trim() === "" || !username || !selectedUser) return;

    const tempId = Date.now();
    const now = Date.now();
    const newMessage = {
      _id: tempId,
      content: input,
      sender: {
        _id: currentUser._id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        profileImg: currentUser.profileImg
      },
      receiver: {
        _id: selectedUser._id,
        username: selectedUser.username,
        fullName: selectedUser.fullName,
        profileImg: selectedUser.profileImg
      },
      timestamp: { $date: { $numberLong: now.toString() } },
      isOptimistic: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/messages/${username}`,
        { 
          content: input,
          timestamp: { $date: { $numberLong: now.toString() } }
        },
        { withCredentials: true }
      );

      setMessages(prev => [
        ...prev.filter(msg => msg._id !== tempId),
        {
          ...response.data,
          sender: {
            _id: currentUser._id,
            username: currentUser.username,
            fullName: currentUser.fullName,
            profileImg: currentUser.profileImg
          },
          receiver: {
            _id: selectedUser._id,
            username: selectedUser.username,
            fullName: selectedUser.fullName,
            profileImg: selectedUser.profileImg
          },
          timestamp: response.data.timestamp || { $date: { $numberLong: now.toString() } }
        }
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const isCurrentUser = (message) => {
    if (message.isOptimistic) return true;
    return message.sender._id === currentUser._id;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white flex-1 lg:ml-60 lg:mr-72 md:ml-20 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-black p-4 border-r border-gray-700 overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {users.map((user) => (
          <div
            key={user._id}
            className={`flex items-center p-3 cursor-pointer rounded-lg mb-2 ${
              username === user.username ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => {
              navigate(`/chat/${user.username}`);
              setSelectedUser(user);
            }}
          >
            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
              {user.profileImg ? (
                <img
                  src={user.profileImg}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{user.fullName}</div>
              <div className="text-xs text-gray-400">@{user.username}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-3/4 bg-black">
        {/* Header */}
        {selectedUser ? (
          <div className="p-4 border-b border-gray-700 flex items-center">
            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
              {selectedUser.profileImg ? (
                <img
                  src={selectedUser.profileImg}
                  alt={selectedUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold">{selectedUser.fullName}</div>
              <div className="text-xs text-gray-400">@{selectedUser.username}</div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-700 font-semibold">
            Select a user to start chatting
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${isCurrentUser(msg) ? "justify-end" : "justify-start"}`}
                >
                  {!isCurrentUser(msg) && (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2 mt-1">
                      {selectedUser?.profileImg ? (
                        <img
                          src={selectedUser.profileImg}
                          alt={selectedUser?.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <UserCircleIcon className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg break-words ${
                      isCurrentUser(msg)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {msg.content}
                    <div className="text-xs mt-1 opacity-70">
                      {formatMessageTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">
              {selectedUser ? "No messages yet" : "Select a user to start chatting"}
            </div>
          )}
        </div>

        {/* Input Box */}
        {selectedUser && (
          <div className="p-4 border-t border-gray-700 flex items-center gap-2 bg-gray-800">
            <input
              type="text"
              className="flex-1 p-2 rounded-lg focus:outline-none bg-gray-700 text-white focus:ring-2 focus:ring-blue-600"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none relative"
              onClick={sendMessage}
              disabled={isSending}
            >
              <PaperAirplaneIcon
                className={`h-5 w-5 transform rotate-90 ${
                  isSending ? "animate-fly" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Global styles for scrollbar hiding */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fly {
          0% { transform: rotate(90deg) translateX(0); opacity: 1; }
          50% { transform: rotate(90deg) translateX(20px); opacity: 0.5; }
          100% { transform: rotate(90deg) translateX(40px); opacity: 0; }
        }
        .animate-fly {
          animation: fly 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}