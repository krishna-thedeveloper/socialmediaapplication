import React, { useState } from "react";


export default function ChatUI() {
  const [users,setUsers] = useState([
    { id: 1, name: "Alice Whitman" },
    { id: 2, name: "Steve Ballmer" },
    { id: 3, name: "Maya Kasuma" },
  ])
  const [messagesData,setMessagesData] = useState({
    1: [{ sender: "Alice", text: "Hello! How are you?" }],
    2: [{ sender: "Steve", text: "Developers! Developers!" }],
    3: [{ sender: "Maya", text: "Let's meet at 5 PM." }],
  })
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(messagesData[selectedUser.id]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex md:w-5/6 lg:w-3/4 lg:ml-60 lg:mr-72 md:ml-20 overflow-y-auto scrollbar-hidden h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-black p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-2 cursor-pointer rounded-lg ${
              selectedUser.id === user.id ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              setMessages(messagesData[user.id]);
            }}
          >
                      <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center border-4 border-gray-800 shadow-lg">
                        {user.profileImg ? (
                          <img
                            src={user.profileImg}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="h-20 w-20 text-gray-400" />
                        )}
                      </div>
                            
            {user.name}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-3/4">
        {/* Header */}
        <div className="bg-gray-800 p-4 text-lg font-bold">
          {selectedUser.name}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.sender === "You" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.sender === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 bg-gray-800 flex">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 rounded-lg text-white"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="ml-2 bg-blue-500 px-4 py-2 rounded-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
