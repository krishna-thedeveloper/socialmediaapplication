import React from 'react'
import { Link } from 'react-router-dom';
const UserSearch = ({user}) => {
  return (
    <Link to={`/profile/${user.username}`} className=" hover:underline">
    <div className='flex gap-3 my-5'  >
              <div className='h-10 w-10 rounded-full bg-slate-600'></div>
              <div ><h5 className='text-xl'>{user.fullName}</h5><h5 className='text-sm'>@{user.username}</h5></div>
              <button className='bg-white text-black rounded-3xl px-5 font-bold'>follow</button>  
              
    </div>
    </Link>
  )
}

export default UserSearch
