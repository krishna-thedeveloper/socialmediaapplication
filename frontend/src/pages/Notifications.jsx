import React, { useEffect, useState } from 'react'

const Notifications = () => {
    const [notifications,setNotifications] = useState()

    const getNotifications = async ()=>{
        const response =await fetch("http://localhost:3000/api/notifications/",{credentials: 'include' })
        const data = await response.json()
        console.log(data)
        if(response.ok){
          setNotifications(data)
        }
      }
    useEffect(()=>{
    getNotifications()
    },[])
    if(!notifications){
        return <div>loading ...</div>
      }
  return (
    <div className='max-sm:pb-20 flex flex-col flex-1  lg:ml-60 lg:mr-72 md:ml-20 overflow-y-auto mt-2 '>
      <div className='border-b-2 '>
        <h1 className='font-bold text-2xl p-2'>Notifications</h1>
      </div>
      <div>
        <div>
        {notifications.map((notification)=>{
            if(notification.type == 'like'){
            return <div className='border-b flex p-2 gap-5'>
            <div className='h-10 w-10 rounded-full bg-slate-900'></div>
            
             <div> @{notification.from.username} liked your post</div>
        </div>
            }else{
                return <div className='border-b flex p-2 gap-5'>
                <div className='h-10 w-10 rounded-full bg-slate-900'></div>
                
                 <div> @{notification.from.username} commented on your post
                 <div className=' ms-2'>{notification.text}</div>
                 </div>
                 
            </div>
                }
            })}
        </div>
      </div>

    </div>
  )
}

export default Notifications
