import React from 'react'
import PostFooter from '../components/PostFooter'
import { HeartIcon,EyeIcon } from '@heroicons/react/24/outline'
const Home = () => {
  return (
    <div className="flex flex-col flex-1 ">
        <div className="flex justify-around border-b text-3xl font-bold p-5 ">
          <div>for you </div><div>following</div>
          </div>
        <div className="flex flex-col w-10/12">
          <div className='border-t'>
            <div><span className='text-white text-2xl'>krishna</span><span className='text-slate-700 text-xl'>@krishna . 9h</span> </div>
            <div className='flex justify-around'>
              <PostFooter Icon={HeartIcon} text="5.1k"/>
              <PostFooter Icon={HeartIcon} text="5.1k"/>
              <PostFooter Icon={EyeIcon} text="5.1k"/>
              
            </div>
          </div>
        </div>
      </div>
  )
}

export default Home
