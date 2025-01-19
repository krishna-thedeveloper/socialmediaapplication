import React, { useEffect, useState } from 'react'
import PostFooter from '../components/PostFooter'
import CommentSection from './CommentSection';
import { HeartIcon, EyeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

const Post = ({ post,setActiveCommentPostId,activeCommentPostId }) => {
  console.log(post)
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [viewCount, setViewCount] = useState(post.views);
  const [isLiked,setIsLiked]=useState(false)



  return (
    <div className='border m-2 p-2 rounded-xl w-10/12'>
      <div>
        <span className='text-white text-2xl'>{post.user.fullName}</span>
        <span className='text-slate-700 text-xl'>@{post.user.username} . {post.time || "1h"}</span>
      </div>
      <div className='p-3'>{post.text}</div>
      <div className='flex justify-around'>
        <PostFooter  Icon={ isLiked ? HeartIconSolid : HeartIcon} text={likeCount} pid={post._id} type="l" setLikeCount={setLikeCount} isLiked={isLiked} setIsLiked={setIsLiked} />
        <PostFooter  Icon={ChatBubbleLeftIcon} setActiveCommentPostId={setActiveCommentPostId} activeCommentPostId={activeCommentPostId} text={commentCount} pid={post._id} type="c" setCommentCount={setCommentCount} />
        <PostFooter Icon={EyeIcon} text={viewCount} pid={post._id} type="v"  setViewCount={setViewCount}/>
      </div>
      {activeCommentPostId == post._id && (
              <CommentSection postId={activeCommentPostId} setActiveCommentPostId={setActiveCommentPostId} setCommentCount={setCommentCount} />
            )}
    </div>
  );
};

export default Post;
