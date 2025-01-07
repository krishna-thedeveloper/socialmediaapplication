import React from 'react'


const Signup = () => {
    let formitems =['name','email','username']
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
        <div className='flex flex-col p-5 rounded-2xl justify-around gap-3'>
        <h1 className='text-6xl text-white'>Signup</h1>

        {formitems.map((item)=>(
            <input className=' outline-0 p-2 bg-inherit text-2xl text-slate-700' name={item} placeholder={item} type="text"/>
  ))
  }
        <input className='outline-0 p-2 bg-inherit text-2xl' name='password' placeholder='password' type="password" />

        <button className='border rounded-xl' type='submit'>Signup</button>
        </div>
      
    </div>
  )
}

export default Signup
