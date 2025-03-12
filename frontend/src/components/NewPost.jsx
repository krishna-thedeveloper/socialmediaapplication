import React, { useState } from "react";

const NewPost = ({ setNewPostShow }) => {
  const [postType, setPostType] = useState("normal"); // 'normal' or 'crowdfunding'
  const [postContent, setPostContent] = useState("");
  const [crowdfundDetails, setCrowdfundDetails] = useState({
    title: "",
    description: "",
    goalAmount: "",
  });
  const [isBankLinked, setIsBankLinked] = useState(false);

  // Check if the user has linked their bank (simulated)
  const checkBankLink = async () => {
    const response = await fetch("http://localhost:3000/api/user/bank-status", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    setIsBankLinked(data.bankLinked);
  };

  const handleChange = (e) => setPostContent(e.target.value);

  const handleCrowdfundChange = (e) => {
    setCrowdfundDetails({ ...crowdfundDetails, [e.target.name]: e.target.value });
  };

  const handlePostSubmit = async () => {
    let data;

    if (postType === "normal") {
      data = { text: postContent };
    } else if (postType === "crowdfunding") {
      if (!isBankLinked) {
        alert("Please link your bank account before creating a crowdfunding post.");
        return;
      }
      data = { ...crowdfundDetails };
    }

    const endpoint =
      postType === "normal"
        ? "http://localhost:3000/api/posts/create"
        : "http://localhost:3000/api/crowdfund/create";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert(postType === "normal" ? "Post created successfully!" : "Crowdfunding post created!");
      setPostContent("");
      setCrowdfundDetails({ title: "", description: "", goalAmount: "" });
      setNewPostShow(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]"
      onClick={() => setNewPostShow(false)}
    >
      <div
        className="bg-slate-900 p-6 rounded-lg w-80 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>

        {/* Post Type Selection */}
        <div className="mb-4 flex gap-2">
          <button
            className={`px-4 py-2 rounded-md ${postType === "normal" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
            onClick={() => setPostType("normal")}
          >
            Normal Post
          </button>
          <button
            className={`px-4 py-2 rounded-md ${postType === "crowdfunding" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
            onClick={() => {
              setPostType("crowdfunding");
              checkBankLink();
            }}
          >
            Crowdfunding Post
          </button>
        </div>

        {/* Normal Post */}
        {postType === "normal" && (
          <textarea
            value={postContent}
            onChange={handleChange}
            placeholder="Write something..."
            className="w-full bg-inherit p-3 mb-4 border border-gray-300 rounded-md"
            rows="5"
          />
        )}

        {/* Crowdfunding Post */}
        {postType === "crowdfunding" && (
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={crowdfundDetails.title}
              onChange={handleCrowdfundChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={crowdfundDetails.description}
              onChange={handleCrowdfundChange}
              className="w-full bg-inherit p-2 mb-2 border border-gray-300 rounded-md"
              rows="3"
            />
            <input
              type="number"
              name="goalAmount"
              placeholder="Goal Amount"
              value={crowdfundDetails.goalAmount}
              onChange={handleCrowdfundChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            {!isBankLinked && (
              <button
                onClick={() => alert("Redirecting to bank linking...")}
                className="w-full bg-red-500 text-white py-2 mb-2 rounded-md"
              >
                Link Bank Account
              </button>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setNewPostShow(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handlePostSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={postType === "crowdfunding" && !isBankLinked}
          >
            {postType === "normal" ? "Post" : "Create Fundraiser"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
