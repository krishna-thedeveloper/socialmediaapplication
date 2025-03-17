import React, { useState } from "react";
import axios from "axios";
import useFetch from "../fetchdata/useFetch";

const MessageUserSearch = ({ onSelectUser }) => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  const searchUsers = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/users/profile/' + username, {
            credentials: 'include'
        });
      setUsers([response.data]); // Assuming the API returns a single user
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    }
  };

  return (
    <div>
      <input
        className="text-black"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Search by username"
      />
      <button onClick={searchUsers}>Search</button>
      <div>
        {users.map((user) => (
          <div key={user._id} onClick={() => onSelectUser(user)}>
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageUserSearch;