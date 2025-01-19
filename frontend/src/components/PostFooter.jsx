import React, { useEffect } from 'react'


const PostFooter = ({Icon,text,pid,type,setViewCount,setLikeCount,setActiveCommentPostId,isLiked,setIsLiked,activeCommentPostId}) => {
    // Handle Like functionality
    const handleLike = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/like/${pid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });
        
        if (!response.ok) {
          throw new Error('Failed to like the post');
        }
  
        const data = await response.json();
        setLikeCount(data.numberOfLikes)
        setIsLiked(data.isLiked)
        console.log(data);
      } catch (error) {
        console.error('Error liking the post:', error);
      }
    };
  

    const handleComment = async () => {
      if(activeCommentPostId == pid){
      return  setActiveCommentPostId(null)
      }
      setActiveCommentPostId(pid)
    }
    const handleonClick = ()=>{
      if(type === 'l')  handleLike()
      else if(type === 'c'){
          handleComment()
    }
    else{
  }
    }
    const classStyle= "size-8 cursor-pointer " + (isLiked ? "text-red-600":"")
  return (
    <div className="text-white flex flex-col items-center">
      <Icon onClick={handleonClick} className={classStyle} />
      <span>{text}</span>
    </div>
  )
}

export default PostFooter
