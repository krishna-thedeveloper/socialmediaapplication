import React from 'react'
import SideRow from '../components/SideRow'
import { HomeIcon,BellIcon,EnvelopeIcon,UserIcon } from '@heroicons/react/24/outline'

const Bottombar = () => {
  return (
    <div className="flex border-t justify-around w-screen fixed bottom-0 md:hidden">
      <SideRow Icon={HomeIcon} title="Home"/>
      <SideRow Icon={BellIcon} title="Notifications"/>
      <SideRow Icon={EnvelopeIcon} title="Messages"/>
      <SideRow Icon={UserIcon} title="Profile"/>

      </div>
  )
}

export default Bottombar
