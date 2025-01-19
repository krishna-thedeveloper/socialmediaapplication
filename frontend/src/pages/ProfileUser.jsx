import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Post from '../components/Post';
import { useParams } from 'react-router-dom';

const ProfileUser = () => {
    const { username } = useParams();
    const [posts, setPosts] = useState([]); // Initialize posts as an array

    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);


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
        return <div>Loading user data...</div>;
    }

    if (isError) {
        return <div>{error}</div>;
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
                        <span>{user.following} following</span> <span>{user.followers} followers</span>
                    </div>
                </div>
                <div className="flex gap-5 text-xl ps-3 pb-2">
                    <div>
                        posts
                    </div>
        
                </div>
            </div>
            {!posts.length ? (
                <div>No posts</div>
            ) : (
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
        </div>
    );
};

export default ProfileUser;
