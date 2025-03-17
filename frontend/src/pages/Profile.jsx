import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
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
      console.log(updateUser)
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

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
            <h5>
              {postType === 'posts' && `${posts.length} Posts`}
              {postType === 'likes' && `${posts.length} Likes`}
              {postType === 'campaigns' && `${campaigns.length} Campaigns`}
            </h5>
          </div>
          <button onClick={handleEditClick} className="ml-auto bg-blue-500 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        </div>
        <div className="h-56 w-full bg-slate-800 relative">
          <img
            src={user.coverImg || 'https://via.placeholder.com/800x200'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-slate-500 rounded-full h-36 w-36 border-2 border-black overflow-hidden">
            <img
              src={user.profileImg || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
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
            Posts
          </div>
          <div
            className={postType === 'likes' ? 'border-b-4 border-b-blue-500' : ''}
            onClick={() => setPostType('likes')}
          >
            Likes
          </div>
          <div
            className={postType === 'campaigns' ? 'border-b-4 border-b-blue-500' : ''}
            onClick={() => setPostType('campaigns')}
          >
            Campaigns
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin w-10 h-10 p-2 border-t-2 border-t-slate-200 rounded-full"></div>
        </div>
      )}
      {!isLoading && postType === 'posts' && !posts.length && <div>No posts found.</div>}
      {!isLoading && postType === 'likes' && !posts.length && <div>No liked posts found.</div>}
      {!isLoading && postType === 'campaigns' && !campaigns.length && <div>No campaigns found.</div>}
      {!isLoading && postType !== 'campaigns' && posts.length > 0 && (
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
      {!isLoading && postType === 'campaigns' && campaigns.length > 0 && (
        <div className="flex flex-col items-center">
          {campaigns.map((campaign) => (
            <Campaign key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-600 p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded text-black"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
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