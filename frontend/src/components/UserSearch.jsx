import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
const UserSearch = ({user}) => {
  const [isLoading,setIsLoading] = useState(false)
  const {user:currentUser} = useUser()
  const [isFollwing,setIsFollowing]=useState(currentUser.following.includes(user._id))
  const handleClick = async ()=>{
    try{
      setIsLoading(true)
    const response = await fetch("http://localhost:3000/api/users/follow/"+user.username,{
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
    })
    if(response.ok){
      setIsFollowing(!isFollwing)
    }
  }catch(error){
    console.log(error)
  }finally{
    setIsLoading(false)
  }
  }
  return (

    <div className='flex gap-2 my-5 p-2'  >
          <Link to={`/profile/${user.username}`} className="flex gap-2 hover:underline">
              <div className='h-10 w-10 rounded-full bg-slate-600'></div>
              <div ><h5 className='text-xl'>{user.fullName}</h5><h5 className='text-sm'>@{user.username}</h5></div>
          </Link>
              <button onClick={handleClick} className='bg-white text-black rounded-3xl px-5 font-bold'>
              {isLoading ? <div className='flex justify-center'>
          <div className='animate-spin w-6 h-6 p-2 border-t-2 border-black rounded-full '> </div>
          </div>  :
              (isFollwing ? "unfollow" : "follow")
          }</button>  
              
    </div>
    
  )
}

export default UserSearch
