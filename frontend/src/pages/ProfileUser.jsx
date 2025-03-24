import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Post from '../components/Post';
import { useParams,useNavigate } from 'react-router-dom';

const ProfileUser = () => {
    const { username } = useParams();
    const [posts, setPosts] = useState([]); // Initialize posts as an array
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);
    
    const navigate = useNavigate();

    const getUser = async () => {
        setIsUserLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/users/profile/' + username, {
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data)
            if (data) {
                setUser(data);
            }
        } catch (error) {
            setIsError(true);
            setError('Failed to load user data');
            console.log(error);
        } finally {
            setIsUserLoading(false);
        }
    };

    const getPosts = async () => {
        if (!user) return; // Avoid fetching posts if the user is not available
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/posts/user/${username}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setPosts(data);
            }
        } catch (error) {
            setIsError(true);
            setError('Failed to load posts');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUser(); // Fetch user data when component mounts
    }, [username]);

    useEffect(() => {
        if (user && user.username) {
            getPosts(); // Fetch posts when user data is available and postType changes
        }
    }, [user]);

    if (isUserLoading) {
        return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="max-sm:pb-20 flex flex-col flex-1 lg:ml-60 lg:mr-72 md:ml-20 overflow-y-auto mt-2">
            <div className="flex flex-col flex-1">
                {/* Header Section */}
                <div className="flex gap-5 items-center p-4 border-b border-gray-700">
                    <ArrowLeftIcon className="size-5 text-white cursor-pointer hover:text-gray-400 transition duration-300" />
                    <div>
                        <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
                        <h5 className="text-gray-400">{posts.length} posts</h5>
                    </div>
                </div>

                {/* Cover Placeholder */}
                <div className="h-48 w-full bg-gray-800 flex justify-center items-center">
                    <div className="text-gray-500 text-2xl font-semibold">
                        
                    </div>
                </div>

                {/* Profile Placeholder */}
                <div className="flex justify-center -mt-16">
                    <div className="bg-gray-700 rounded-full h-32 w-32 flex items-center justify-center border-4 border-gray-800 shadow-lg">
                        <UserCircleIcon className="h-20 w-20 text-gray-400" />
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
                        <button onClick={()=>navigate('/chat/'+user.username)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                            Message
                        </button>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="flex gap-5 text-xl ps-3 pb-2 border-b border-gray-700">
                    <div className="text-white font-semibold">
                        Posts
                    </div>
                </div>
            </div>

            {/* Posts List */}
            {!posts.length ? (
                <div className="flex justify-center items-center h-40 text-gray-400">No posts available</div>
            ) : (
                <div className="flex flex-col items-center p-4">
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
        </div>
    );
};

export default ProfileUser;