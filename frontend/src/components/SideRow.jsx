import React from 'react'

const SideRow = ({Icon,title}) => {
  return (
    <div className=" p-5 gap-2 text-2xl font-bold flex">
               <Icon className="size-8 text-white" />
               <span className='hidden lg:block'>{title}</span>
    </div>
  )
}

export default SideRow
