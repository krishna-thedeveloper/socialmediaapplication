import React, { useState } from "react";
import PostFooter from "../components/PostFooter";
import CommentSection from "./CommentSection";
import { HeartIcon, EyeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useUser } from "../context/UserContext";

const Post = ({ post, setActiveCommentPostId, activeCommentPostId, onDelete }) => {
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [viewCount, setViewCount] = useState(post.views);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const {user}=useUser()
  const handleReport = async () => {
    if (!reportReason) return alert("Please select a reason");

    try {
      await axios.post("http://localhost:3000/api/reports/", {
        reportedBy: post.user,
        reportedPost: post._id,
        reason: reportReason,
      });

      alert("Report submitted successfully");
      setShowReportModal(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting post", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/posts/${post._id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("Post deleted successfully");
        onDelete(post._id); // Call the callback to update the parent component
      }
    } catch (error) {
      console.error("Error deleting post", error);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="border m-2 p-2 rounded-xl w-10/12 relative">
      <div className="flex justify-between">
        <div>
          <span className="text-white text-2xl">{post.user.fullName}</span>
          <span className="text-slate-500 text-xl">@{post.user.username} • {post.createdAt?.split("T")[0]}</span>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} className="p-1">
          <EllipsisVerticalIcon className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-2 top-10 bg-gray-800 text-white p-2 rounded-md shadow-md">
          <button onClick={() => setShowReportModal(true)} className="block px-4 py-2 text-sm">
            Report Post
          </button>
          {user && user._id === post.user._id && (
            <button
              onClick={() => {
                handleDelete(); // Call the delete function
                setShowMenu(false); // Close the menu
              }}
              className="block px-4 py-2 text-sm text-red-500"
            >
              Delete Post
            </button>
          )}
        </div>
      )}

      {post.img && <img src={post.img} alt={post.title} className="w-full h-60 object-cover mt-2 rounded-lg" />}
      <div className="p-3">{post.text}</div>
      <div className="flex justify-around">
        <PostFooter
          Icon={isLiked ? HeartIconSolid : HeartIcon}
          text={likeCount}
          pid={post._id}
          type="l"
          setLikeCount={setLikeCount}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
        />
        <PostFooter
          Icon={ChatBubbleLeftIcon}
          setActiveCommentPostId={setActiveCommentPostId}
          activeCommentPostId={activeCommentPostId}
          text={commentCount}
          pid={post._id}
          type="c"
          setCommentCount={setCommentCount}
        />
        <PostFooter Icon={EyeIcon} text={viewCount} pid={post._id} type="v" setViewCount={setViewCount} />
      </div>

      {activeCommentPostId === post._id && (
        <CommentSection postId={activeCommentPostId} setActiveCommentPostId={setActiveCommentPostId} setCommentCount={setCommentCount} />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
          onClick={() => setShowReportModal(false)}
        >
          <div 
            className="p-5 rounded-lg w-96 bg-black relative"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Report Post</h3>
              <button onClick={() => setShowReportModal(false)}>
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <select
              className="w-full p-2 mt-3 border rounded-md bg-inherit"
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option className="bg-inherit" value="">Select a reason</option>
              <option className="bg-inherit" value="spam">Spam</option>
              <option className="bg-inherit" value="harassment">Harassment</option>
              <option className="bg-inherit" value="misinformation">Misinformation</option>
            </select>
            <div className="flex justify-end mt-4">
              <button onClick={handleReport} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;