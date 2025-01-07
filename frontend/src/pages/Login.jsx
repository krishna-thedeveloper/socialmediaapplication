import React from 'react'

const Login = () => {
  return (
    <div className='h-screen w-screen items-center'>
        <div className='flex flex-col border p-5 text-white'>
        <h1 className='text-5xl '>Login</h1>

        <input className='outline-0 p-2 bg-inherit' name='username' placeholder='username' type="username" />
        <input className='outline-0 p-2 bg-inherit' name='password' placeholder='password' type="password" />

        <button className='border rounded-xl' type='submit'>Login</button>
        </div>
      
    </div>
  )
}

export default Login
