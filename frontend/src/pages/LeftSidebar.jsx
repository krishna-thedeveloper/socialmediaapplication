import React from 'react'
import SideRow from '../components/SideRow'
import { HomeIcon,BellIcon,EnvelopeIcon,UserIcon } from '@heroicons/react/24/outline'
const Sidebar = () => {
  return (
    <div className="flex flex-col border-e hidden md:block">
      <SideRow Icon={HomeIcon} title="Home"/>
      <SideRow Icon={BellIcon} title="Notifications"/>
      <SideRow Icon={EnvelopeIcon} title="Messages"/>
      <SideRow Icon={UserIcon} title="Profile"/>

      </div>
  )
}

export default Sidebar
