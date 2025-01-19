import React from 'react'
import SideRow from './SideRow'
import { HomeIcon,BellIcon,EnvelopeIcon,UserIcon } from '@heroicons/react/24/outline'

const Bottombar = () => {
  return (
    <div className="flex border-t justify-around bg-inherit w-screen fixed bottom-0 md:hidden">
      <SideRow Icon={HomeIcon} title="Home" nav='/' />
      <SideRow Icon={BellIcon} title="Notifications" nav='/notifications'/>
      <SideRow Icon={EnvelopeIcon} title="Messages" nav='/messages'/>
      <SideRow Icon={UserIcon} title="Profile" nav='/profile'/>

      </div>
  )
}

export default Bottombar
