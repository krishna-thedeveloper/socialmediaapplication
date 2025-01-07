import React from 'react'

const PostFooter = ({Icon,text}) => {
  return (
    <div className="text-white">
      <Icon className="size-8 " />
      <span>{text}</span>
    </div>
  )
}

export default PostFooter
