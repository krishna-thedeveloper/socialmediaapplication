import React from 'react'
import { useNavigate } from 'react-router-dom'

const SideRow = ({Icon,title,nav}) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(nav);
  };
  return (
    <div onClick={handleClick} className=" p-5 gap-2 text-2xl font-bold flex">
               <Icon className="size-8 text-white" />
               <span className='hidden lg:block'>{title}</span>
    </div>
  )
}

export default SideRow

