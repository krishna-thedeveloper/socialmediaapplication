import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Post from '../components/Post';
import useFetch from '../fetchdata/useFetch';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const [posts, setPosts] = useState([]); // Initialize posts as an array
  const [postType, setPostType] = useState('posts');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [isLoading,setIsLoading] = useState(false)
  const {user}=useUser()
  //const { data:user, isLoading, isError, error } = useFetch('/api/auth/me', { credentials: 'include' });
  
  // Determine endpoint based on postType and user info
  const getEndpoint = () => {
    if (postType === 'likes') {
      return `likes/${user._id}`;
    } else {
      return `user/${user.username}`;
    }
  };

  // Get posts based on user and postType
  const getPosts = async () => {
    setIsLoading(true)
    const response = await fetch(`http://localhost:3000/api/posts/${getEndpoint()}`, { credentials: 'include' })
    const data = await response.json()

    if (data) {
      setPosts(data);
    }
    setIsLoading(false)
  };



  useEffect(() => {
    if (user && user._id) {
      getPosts(); // Fetch posts when user is available and postType changes
    }
  }, [user, postType]);

  if (!user) {
    return <div>Loading user data...</div>;
  }



  return (
    <div className="max-sm:pb-20 flex flex-col flex-1 lg:ml-60 lg:mr-72 md:ml-20 overflow-y-auto mt-2">
      <div className="flex flex-col flex-1">
        <div className="flex gap-5 items-center">
          <ArrowLeftIcon className="size-5 text-white" />
          <div>
            <h3 className="text-xl font-bold">{user.fullName}</h3>
            <h5>{posts.length}</h5>
          </div>
        </div>
        <div className="h-1/3 w-full bg-slate-800 relative flex justify-center" style={{ minHeight: '220px' }}>
          <div className="bg-slate-500 rounded-full h-36 w-36 border-2 border-black absolute mt-36"></div>
        </div>
        <div className="flex flex-col gap-5 m-8 mt-20">
          <div>
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <h6>@{user.username}</h6>
          </div>
          <div className="flex gap-4 text-lg">
            <span>{user.following.length} following</span> <span>{user.followers.length} followers</span>
          </div>
        </div>
        <div className="flex gap-5 text-xl justify-around border-b-2">
          <div
            className={postType === 'posts' ? 'border-b-4 border-b-blue-500' : ''}
            onClick={() => setPostType('posts')}
          >
            posts
          </div>
          <div
            className={postType === 'likes' ? 'border-b-4 border-b-blue-500' : ''}
            onClick={() => setPostType('likes')}
          >
            likes
          </div>
        </div>
      </div>
      {!posts.length && !isLoading && (
        <div>No posts</div>
      )} { posts.length>0 && (
        <div className="flex flex-col items-center">
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              setActiveCommentPostId={setActiveCommentPostId}
              activeCommentPostId={activeCommentPostId}
            />
          ))}
          
        </div>
      )}
      {isLoading &&
      <div className='flex justify-center'>
        <div className='animate-spin w-10 h-10 p-2 border-t-2 border-t-slate-200 rounded-full '> </div>
        </div>}
    </div>
  );
};

export default Profile;
