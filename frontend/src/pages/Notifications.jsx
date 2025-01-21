import React, { useEffect, useState } from 'react'

const Notifications = () => {
    const [notifications,setNotifications] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const getNotifications = async ()=>{
      setIsLoading(true)
        const response =await fetch("http://localhost:3000/api/notifications/",{credentials: 'include' })
        const data = await response.json()
        console.log(data)
        if(response.ok){
          setNotifications(data)
        }setIsLoading(false)
      }
    useEffect(()=>{
    getNotifications()
    },[])
  return (
    <div className='max-sm:pb-20 flex flex-col flex-1  lg:ml-60 lg:mr-72 md:ml-20 overflow-y-auto mt-2 '>
      <div className='border-b-2 '>
        <h1 className='font-bold text-2xl p-2'>Notifications</h1>
      </div>
      <div>
        <div>
        {notifications.length>0 ? (notifications.map((notification)=>{
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
            })):(!isLoading && <diV>no notifications</diV>)}
        </div>
        {isLoading &&
      <div className='flex justify-center'>
        <div className='animate-spin mt-5 w-10 h-10 p-2 border-t-2 border-t-slate-200 rounded-full '> </div>
        </div>}
      </div>

    </div>
  )
}

export default Notifications
