import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
const Sugguestbar = () => {
  return (
    <div className="flex flex-col p-2 border-l hidden lg:block">
        <div className="flex bg-slate-800 rounded-full p-2">
          <MagnifyingGlassIcon className='size-8 text-white' />
        <input className="outline-0 pl-5 bg-inherit" type="text" placeholder="Search"/>
        </div>
      </div>
  )
}

export default Sugguestbar
