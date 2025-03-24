import React, { useState } from "react";
import PostFooter from "../components/PostFooter";
import CommentSection from "./CommentSection";
import { 
  HeartIcon, 
  EyeIcon, 
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon, 
  XMarkIcon,
  FlagIcon
} from "@heroicons/react/24/outline";
import { 
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, setActiveCommentPostId, activeCommentPostId, onDelete }) => {
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const [viewCount, setViewCount] = useState(post.views || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { user } = useUser();

  const handleReport = async () => {
    if (!reportReason) return alert("Please select a reason");

    try {
      await axios.post("http://localhost:3000/api/reports/", {
        reportedBy: user._id,
        reportedPost: post._id,
        reason: reportReason,
      }, { withCredentials: true });

      alert("Report submitted successfully");
      setShowReportModal(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting post", error);
      alert("Failed to submit report");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/posts/${post._id}`, {
        withCredentials: true,
      });

      if (response.status === 200 && onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      console.error("Error deleting post", error);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="border m-2 p-4 rounded-xl w-10/12 bg-gray-900 text-white relative">
      {/* Post Header */}
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src={post.user?.profileImg || "/default-profile.png"} 
            alt={post.user?.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover border border-gray-600"
            onError={(e) => {
              e.target.src = "/default-profile.png";
            }}
          />
          <div>
            <div className="text-lg font-semibold">{post.user?.fullName || "Unknown User"}</div>
            <div className="text-slate-400 text-sm">
              @{post.user?.username || "unknown"} • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "just now"}
            </div>
          </div>
        </div>

        {/* Post Menu Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)} 
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
        >
          <EllipsisVerticalIcon className="h-6 w-6 text-gray-400" />
        </button>

        {/* Post Menu Dropdown */}
        {showMenu && (
          <div className="absolute right-2 top-10 bg-gray-800 text-white p-2 rounded-md shadow-md z-10">
            <button 
              onClick={() => {
                setShowReportModal(true);
                setShowMenu(false);
              }}
              className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700 rounded"
            >
              <FlagIcon className="h-4 w-4 inline mr-2 text-red-400" />
              Report Post
            </button>
            {user && user._id === post.user?._id && (
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-700 rounded text-red-500"
              >
                <XMarkIcon className="h-4 w-4 inline mr-2" />
                Delete Post
              </button>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mt-3">
        <p className="text-white">{post.text}</p>
        {post.img && (
          <img 
            src={post.img} 
            alt={post.title || "Post image"} 
            className="w-full h-60 object-cover mt-2 rounded-lg"
            onError={(e) => {
              e.target.src = "/image-placeholder.png";
            }}
          />
        )}
      </div>

      {/* Post Footer */}
      <div className="flex justify-around mt-4 pt-3 border-t border-gray-800">
        <PostFooter
          Icon={isLiked ? HeartIconSolid : HeartIcon}
          activeIcon={HeartIconSolid}
          text={likeCount}
          pid={post._id}
          type="l"
          setLikeCount={setLikeCount}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          className="hover:text-red-500"
        />
        <PostFooter
          Icon={ChatBubbleLeftIcon}
          setActiveCommentPostId={setActiveCommentPostId}
          activeCommentPostId={activeCommentPostId}
          text={commentCount}
          pid={post._id}
          type="c"
          setCommentCount={setCommentCount}
          className="hover:text-blue-500"
        />
        <PostFooter 
          Icon={EyeIcon} 
          text={viewCount} 
          pid={post._id} 
          type="v" 
          setViewCount={setViewCount}
          className="hover:text-green-500"
        />
      </div>

      {/* Comment Section */}
      {activeCommentPostId === post._id && (
        <CommentSection 
          postId={activeCommentPostId} 
          setActiveCommentPostId={setActiveCommentPostId} 
          setCommentCount={setCommentCount} 
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowReportModal(false)}
        >
          <div 
            className="p-5 rounded-lg w-96 bg-black relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Report Post</h3>
              <button onClick={() => setShowReportModal(false)}>
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <select
              className="w-full p-2 mt-3 border rounded-md bg-gray-800 text-white"
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="misinformation">Misinformation</option>
              <option value="violence">Violence</option>
              <option value="hate">Hate speech</option>
            </select>
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleReport} 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
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