import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import CrowdfundPost from '../components/CrowdfundPost'; // Import crowdfunding post component
import useFetch from '../fetchdata/useFetch';
import { useNewpost } from '../context/NewpostContext';
import NewPost from '../components/NewPost';

const Home = () => {
  const [feedType, setFeedType] = useState('for you');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const { newPostShow, setNewPostShow } = useNewpost();

  // Determine the endpoint based on the feedType
  const getEndpoint = () => (feedType === 'following' ? 'following' : 'all');

  // Fetch normal posts
  const { data: posts, isLoading: postsLoading, isError: postsError, error: postsErrorMsg } = 
    useFetch(`/api/posts/${getEndpoint()}`, { credentials: 'include' });

  // Fetch crowdfunding posts
  const { data: crowdfundPosts, isLoading: cfLoading, isError: cfError, error: cfErrorMsg } = 
    useFetch(`/api/crowdfunds/${getEndpoint()}`, { credentials: 'include' });

  // Merge posts and crowdfunding campaigns into one feed
  const combinedPosts = [...(posts || []), ...(crowdfundPosts || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sort by latest
  );

  if (postsError || cfError) {
    return <div>Error: {postsErrorMsg?.message || cfErrorMsg?.message || 'Something went wrong'}</div>;
  }

  return (
    <div className="flex flex-col flex-1 lg:ml-60 lg:mr-72 md:ml-20 overflow-y-auto scrollbar-hidden">
      <div className="flex justify-around border-b text-3xl font-bold p-5 flex-2/4">
        <div
          onClick={() => setFeedType('for you')}
          className={feedType === 'for you' ? 'border-b-2 border-b-blue-500 cursor-pointer' : 'cursor-pointer'}
        >
          for you
        </div>
        <div
          onClick={() => setFeedType('following')}
          className={feedType === 'following' ? 'border-b-2 border-b-blue-500 cursor-pointer' : 'cursor-pointer'}
        >
          following
        </div>
      </div>
      
      <div className="flex flex-col items-center overflow-y-auto scrollbar-hidden">
        {combinedPosts?.map((post) =>
          post.goalAmount ? ( // Check if it's a crowdfunding post
            <CrowdfundPost key={post._id} post={post} />
          ) : (
            <Post 
              key={post._id}
              post={post}
              setActiveCommentPostId={setActiveCommentPostId}
              activeCommentPostId={activeCommentPostId}
            />
          )
        )}

        {!postsLoading && !cfLoading && combinedPosts.length === 0 && <div className='mt-5'>No posts</div>}
        {(postsLoading || cfLoading) && (
          <div className='flex justify-center items-center mt-5'>
            <div className='animate-spin w-10 h-10 p-2 border-t-2 border-t-slate-200 rounded-full'></div>
          </div>
        )}
      </div>

      {newPostShow && <NewPost />}
   
    </div>
  );
};

export default Home;
