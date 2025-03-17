import React, { useState } from "react";
import { useNewpost } from "../context/NewpostContext";
import { useUser } from "../context/UserContext";

const NewPost = () => {
  const { newPostShow, setNewPostShow } = useNewpost();
  const [postType, setPostType] = useState("normal"); // 'normal' or 'crowdfunding'
  const [postContent, setPostContent] = useState("");
  const { user } = useUser();
  const [crowdfundDetails, setCrowdfundDetails] = useState({
    title: "",
    description: "",
    goalAmount: "",
  });
  const [isBankLinked, setIsBankLinked] = useState(user.bankLinked);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
  });
  const [bankLinkSuccess, setBankLinkSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null); // State to store the image file

  const handleChange = (e) => setPostContent(e.target.value);

  const handleCrowdfundChange = (e) => {
    setCrowdfundDetails({ ...crowdfundDetails, [e.target.name]: e.target.value });
  };

  const handleBankDetailsChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleLinkBankAccount = async () => {
    // Simulate linking bank account
    const response = await fetch("http://localhost:3000/api/user/link-bank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(bankDetails),
    });

    if (response.ok) {
      setBankLinkSuccess(true);
      setIsBankLinked(true);
      setShowBankForm(false);
    }
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();

    if (postType === "normal") {
      formData.append("text", postContent);
    } else if (postType === "crowdfunding") {
      if (!isBankLinked) {
        alert("Please link your bank account before creating a crowdfunding post.");
        return;
      }
      formData.append("title", crowdfundDetails.title);
      formData.append("description", crowdfundDetails.description);
      formData.append("goalAmount", crowdfundDetails.goalAmount);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const endpoint =
      postType === "normal"
        ? "http://localhost:3000/api/posts/create"
        : "http://localhost:3000/api/crowdfunds/";

    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.ok) {
      alert(postType === "normal" ? "Post created successfully!" : "Crowdfunding post created!");
      setPostContent("");
      setCrowdfundDetails({ title: "", description: "", goalAmount: "" });
      setImageFile(null); // Clear the image file
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
            }}
          >
            Crowdfunding Post
          </button>
        </div>

        {/* Normal Post */}
        {postType === "normal" && (
          <div>
            <textarea
              value={postContent}
              onChange={handleChange}
              placeholder="Write something..."
              className="w-full bg-inherit p-3 mb-4 border border-gray-300 rounded-md"
              rows="5"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Crowdfunding Post */}
        {postType === "crowdfunding" && (
          <div>
            {!isBankLinked && !showBankForm && !bankLinkSuccess && (
              <button
                onClick={() => setShowBankForm(true)}
                className="w-full bg-red-500 text-white py-2 mb-2 rounded-md"
              >
                Link Bank Account
              </button>
            )}

            {showBankForm && (
              <div>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Account Number"
                  value={bankDetails.accountNumber}
                  onChange={handleBankDetailsChange}
                  className="w-full p-2 mb-2 text-black border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="ifscCode"
                  placeholder="IFSC code"
                  value={bankDetails.ifscCode}
                  onChange={handleBankDetailsChange}
                  className="w-full text-black p-2 mb-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleLinkBankAccount}
                  className="w-full bg-blue-500 text-white py-2 mb-2 rounded-md"
                >
                  Submit Bank Details
                </button>
              </div>
            )}

            {bankLinkSuccess && (
              <div className="text-green-500 mb-2">
                Bank account linked successfully!
              </div>
            )}

            {isBankLinked && (
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={crowdfundDetails.title}
                  onChange={handleCrowdfundChange}
                  className="w-full p-2 mb-2 border text-black border-gray-300 rounded-md"
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
                  className="w-full p-2 mb-2 border text-black border-gray-300 rounded-md"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                />
              </div>
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