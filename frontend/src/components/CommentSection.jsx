import React, { useEffect, useState } from 'react';
import { PaperAirplaneIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ postId, setActiveCommentPostId, setCommentCount, post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useUser();

  const formatTimestamp = (timestamp) => {
    try {
      let date;
      if (timestamp?.$date?.$numberLong) {
        date = new Date(parseInt(timestamp.$date.$numberLong));
      } else {
        date = new Date(timestamp);
      }
      
      const secondsDiff = Math.floor((new Date() - date) / 1000);
      if (secondsDiff < 60) {
        return 'less than a minute ago';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/posts/comment/${postId}?sort=-createdAt`,
        { withCredentials: true }
      );
      setComments(response.data.comments);
      setCommentCount(response.data.numberOfComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    if (post?.comments) {
      const sortedComments = [...post.comments].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComments(sortedComments);
    } else {
      fetchComments();
    }
  }, [postId, post?.comments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    const tempId = Date.now().toString();
    const newCommentObj = {
      _id: tempId,
      text: newComment,
      user: {
        _id: user._id,
        username: user.username,
        profileImg: user.profileImg
      },
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => [newCommentObj, ...prev]);
    setCommentCount(prev => prev + 1);
    setNewComment('');

    try {
      const response = await axios.post(
        `http://localhost:3000/api/posts/comment/${postId}`,
        { text: newComment },
        { withCredentials: true }
      );
      
      if (response.data.comment) {
        setComments(prev => prev.map(c => 
          c._id === tempId ? response.data.comment : c
        ));
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      setComments(prev => prev.filter(c => c._id !== tempId));
      setCommentCount(prev => prev - 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this delete function
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    setDeletingId(commentId);
    try {
      await axios.delete(
        `http://localhost:3000/api/posts/${postId}/comments/${commentId}`,
        { withCredentials: true }
      );
      
      // Optimistic update
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      setCommentCount(prev => prev - 1);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4 w-full">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700">
        <h3 className="text-md font-semibold text-white">
          Comments ({comments.length})
        </h3>
        <button 
          onClick={() => setActiveCommentPostId(null)}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 mb-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-2 group">
              <div className="flex-shrink-0 mt-1">
                {comment.user?.profileImg ? (
                  <img
                    src={comment.user.profileImg}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 bg-gray-700 rounded-lg p-2 relative">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-white">
                    @{comment.user?.username || 'anonymous'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimestamp(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap break-words">
                  {comment.text}
                </p>
                
                {/* Add delete button for comment owner */}
                {user?._id === comment.user?._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    disabled={deletingId === comment._id}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {deletingId === comment._id ? (
                      <span className="loading-spinner h-4 w-4" />
                    ) : (
                      <XMarkIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-4 text-sm">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
        {user?.profileImg ? (
          <img
            src={user.profileImg}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <UserCircleIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
        )}
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-gray-700 text-white rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm border border-gray-600"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
              isSubmitting ? 'text-gray-400' : 'text-blue-400 hover:text-blue-300'
            } disabled:opacity-50`}
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;