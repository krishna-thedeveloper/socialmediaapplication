import React, { useEffect, useState } from 'react';

const CommentSection = ({ postId, setActiveCommentPostId,setCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const getComments = async () => {
    const response = await fetch(`http://localhost:3000/api/posts/comment/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }, 
        credentials: 'include',
      });
    const data = await response.json();
    if (response.ok) {
        console.log("comments...")
        console.log("post id : ",postId)
        console.log(data)
        setCommentCount(data.numberOfComments)
      setComments(data.comments);
    }
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    const response = await fetch(`http://localhost:3000/api/posts/comment/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: newComment })
    });
    if (response.ok) {
      setNewComment('');
      getComments();
    }
  };

  return (
    <div className="bg-inherit p-4 mt-4 w-full rounded-md bottom-20 md:bottom-0">
      <div className="text-white font-bold">Comments</div>
      <div className="mt-2">
        {comments.map((comment, index) => (
          <div key={index} className="mt-2">
            <span className="text-sm font-bold">@{comment.user.username}</span>: {comment.text}
          </div>
        ))}
      </div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        className="mt-2 w-full p-2 rounded-md text-black"
      />
      <button onClick={handleCommentSubmit} className="bg-blue-500 text-white p-2 rounded-md mt-2">
        Post Comment
      </button>
      <button onClick={() => setActiveCommentPostId(null)} className="text-gray-400 mt-2">
        Close Comments
      </button>
    </div>
  );
};

export default CommentSection;
