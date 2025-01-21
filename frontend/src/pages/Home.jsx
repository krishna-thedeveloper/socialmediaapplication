import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import useFetch from '../fetchdata/useFetch';

const Home = () => {
  const [feedType, setFeedType] = useState('for you');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // Determine the endpoint based on the feedType
  const getEndpoint = () => {
    if (feedType === 'following') {
      return 'following';
    } else {
      return 'all';
    }
  };

  // Use the useFetch hook to fetch posts based on the feedType
  const { data: posts, isLoading, isError, error } = useFetch(`/api/posts/${getEndpoint()}`, { credentials: 'include' });



  if (isError) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
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
      <div className="flex flex-col items-center">
        {posts?.map((post) => (
          <Post
            setActiveCommentPostId={setActiveCommentPostId}
            activeCommentPostId={activeCommentPostId}
            key={post.id}  // Using a unique identifier for key
            post={post}
          />
        ))}
        {!isLoading && !isError && posts.length==0 && <div className='mt-5'>No posts</div>}
        { isLoading && <div className='flex justify-center items-center mt-5'>
        <div className='animate-spin w-10 h-10 p-2 border-t-2 border-t-slate-200 rounded-full '> </div>
        </div>}
      </div>
    </div>
  );
};

export default Home;
