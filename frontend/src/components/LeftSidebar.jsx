import React, { useState } from 'react'
import SideRow from './SideRow'
import { HomeIcon,BellIcon,EnvelopeIcon,UserIcon } from '@heroicons/react/24/outline'
import NewPost from './NewPost'


const Sidebar = () => {
  const [newPostShow,setNewPostShow]=useState(false)
  const handleNewPost = ()=>{
    setNewPostShow(true)
  }

  
  return (
    <div className="flex flex-col border-e hidden md:block fixed top-0 left-0 h-full">
      <div>
      <SideRow Icon={HomeIcon} title="Home" nav='/' />
      <SideRow Icon={BellIcon} title="Notifications" nav='/notifications' />
      <SideRow Icon={EnvelopeIcon} title="Messages" nav='/messages' />
      <SideRow Icon={UserIcon} title="Profile" nav='/profile' />
      </div>
      <div onClick={handleNewPost} className='text-white text-2xl bg-blue-950 rounded-2xl w-52 p-3 m-2 fixed bottom-0'>
      New post
      </div>
      {newPostShow && <NewPost setNewPostShow={setNewPostShow} /> }
      </div>
  )
}

export default Sidebar
