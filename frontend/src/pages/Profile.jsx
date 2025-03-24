import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Post from '../components/Post'; // Existing Post component
import Campaign from '../components/Campaign'; // New Campaign component
import { useUser } from '../context/UserContext';

const Profile = () => {
  const [posts, setPosts] = useState([]); // For regular posts
  const [campaigns, setCampaigns] = useState([]); // For crowdfunding campaigns
  const [postType, setPostType] = useState('posts'); // 'posts', 'likes', or 'campaigns'
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    profileImage: null, // File object for profile image
    coverImage: null, // File object for cover image
  });
  const { user, updateUser } = useUser();
  const handleDeleteCampaign = (campaignId) => {
    setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign._id !== campaignId)
    );
};
  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  // Determine endpoint based on postType and user info
  const getEndpoint = () => {
    if (postType === 'likes') {
      return `likes/${user._id}`;
    } else if (postType === 'campaigns') {
      return `user/${user._id}`; // Endpoint for fetching campaigns
    } else {
      return `user/${user.username}`; // Endpoint for fetching posts
    }
  };

  // Fetch data based on postType
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (postType === 'campaigns') {
        // Fetch campaigns
        const response = await fetch(`http://localhost:3000/api/crowdfunds/${getEndpoint()}`, {
          credentials: 'include',
        });
        const data = await response.json();
        setCampaigns(data);
      } else {
        // Fetch posts or likes
        const response = await fetch(`http://localhost:3000/api/posts/${getEndpoint()}`, {
          credentials: 'include',
        });
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchData(); // Fetch data when user is available or postType changes
    }
  }, [user, postType]);

  const handleEditClick = () => {
    setFormData({
      fullName: user.fullName,
      username: user.username,
      profileImage: null, // Reset file input
      coverImage: null, // Reset file input
    });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0], // Store the selected file
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append('fullName', formData.fullName);
      formPayload.append('username', formData.username);
      if (formData.profileImage) {
        formPayload.append('profileImage', formData.profileImage);
      }
      if (formData.coverImage) {
        formPayload.append('coverImage', formData.coverImage);
      }

      const response = await fetch(`http://localhost:3000/api/users/update`, {
        method: 'PUT',
        credentials: 'include',
        body: formPayload, // Send as FormData
      });
      const updatedUser = await response.json();
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
  }

  return (
    <div className="max-sm:pb-20 flex flex-col flex-1 lg:ml-60 lg:mr-72 md:ml-20 overflow-y-auto mt-2">
      <div className="flex flex-col flex-1">
        {/* Header Section */}
        <div className="flex gap-5 items-center p-4 border-b border-gray-700">
          <ArrowLeftIcon className="size-5 text-white cursor-pointer hover:text-gray-400 transition duration-300" />
          <div>
            <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
            <h5 className="text-gray-400">
              {postType === 'posts' && `${posts.length} Posts`}
              {postType === 'likes' && `${posts.length} Likes`}
              {postType === 'campaigns' && `${campaigns.length} Campaigns`}
            </h5>
          </div>
          <button
            onClick={handleEditClick}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Edit Profile
          </button>
        </div>

        {/* Cover Placeholder */}
        <div className="h-56 w-full bg-gradient-to-r from-purple-800 to-indigo-900 flex justify-center items-center">
          {user.coverImg ? (
            <img
              src={user.coverImg}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-2xl font-semibold">Cover Placeholder</div>
          )}
        </div>

        {/* Profile Placeholder */}
        <div className="flex justify-center -mt-16">
          <div className="bg-gray-700 rounded-full h-32 w-32 flex items-center justify-center border-4 border-gray-800 shadow-lg">
            {user.profileImg ? (
              <img
                src={user.profileImg}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-20 w-20 text-gray-400" />
            )}
          </div>
        </div>

        {/* User Info Section */}
        <div className="flex flex-col gap-5 m-8 mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
            <h6 className="text-gray-400">@{user.username}</h6>
          </div>
          <div className="flex gap-4 text-lg justify-center items-center">
            <span className="text-gray-300">{user.following.length} following</span>
            <span className="text-gray-300">{user.followers.length} followers</span>
          </div>
        </div>

        {/* Tabs for Posts, Likes, and Campaigns */}
        <div className="flex gap-5 text-xl justify-around border-b-2 border-gray-700 pb-2">
          <div
            className={`cursor-pointer ${
              postType === 'posts' ? 'border-b-4 border-b-blue-500 text-white' : 'text-gray-400 hover:text-white'
            } transition duration-300`}
            onClick={() => setPostType('posts')}
          >
            Posts
          </div>
          <div
            className={`cursor-pointer ${
              postType === 'likes' ? 'border-b-4 border-b-blue-500 text-white' : 'text-gray-400 hover:text-white'
            } transition duration-300`}
            onClick={() => setPostType('likes')}
          >
            Likes
          </div>
          <div
            className={`cursor-pointer ${
              postType === 'campaigns' ? 'border-b-4 border-b-blue-500 text-white' : 'text-gray-400 hover:text-white'
            } transition duration-300`}
            onClick={() => setPostType('campaigns')}
          >
            Campaigns
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin w-10 h-10 p-2 border-t-2 border-t-slate-200 rounded-full"></div>
        </div>
      )}

      {/* Empty State Messages */}
      {!isLoading && postType === 'posts' && !posts.length && (
        <div className="flex justify-center items-center h-40 text-gray-400">
          <span>No posts found.</span>
        </div>
      )}
      {!isLoading && postType === 'likes' && !posts.length && (
        <div className="flex justify-center items-center h-40 text-gray-400">
          <span>No liked posts found.</span>
        </div>
      )}
      {!isLoading && postType === 'campaigns' && !campaigns.length && (
        <div className="flex justify-center items-center h-40 text-gray-400">
          <span>No campaigns found.</span>
        </div>
      )}

      {/* Posts List */}
      {!isLoading && postType !== 'campaigns' && posts.length > 0 && (
        <div className="flex flex-col items-center p-4">
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              setActiveCommentPostId={setActiveCommentPostId}
              activeCommentPostId={activeCommentPostId}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}

      {/* Campaigns List */}
      {!isLoading && postType === 'campaigns' && campaigns.length > 0 && (
        <div className="flex flex-col items-center p-4">
          {campaigns.map((campaign) => (
            <Campaign key={campaign._id} campaign={campaign} onDelete={handleDeleteCampaign}/>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-800 p-6 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Profile</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded bg-slate-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded bg-slate-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded bg-slate-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded bg-slate-700 text-white"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;