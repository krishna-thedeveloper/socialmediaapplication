import React, { useContext, useEffect, useState } from 'react';
import InputFeild from '../components/InputFeild';
import useFetch from '../fetchdata/useFetch';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {

  const navigate = useNavigate();
  const {login,setIsLoggedIn} = useUser()

  const checkAuth = async () => {

    const response = await fetch("http://localhost:3000/api/auth", { credentials: 'include' });
    const data = await response.json();
    
    if (response.ok) {
      login(data);  // assuming data contains user details
      setIsLoggedIn(true);

      navigate('/')
    } else {

      setIsLoggedIn(false);
    }
  
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Get form values from FormData
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      console.log(formValues); // Log the form values for debugging
  
      // Send the form values directly in the body of the fetch request
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formValues), // Use formValues directly here
      });
  
      const data = await response.json();
      console.log(data); // Log the response data
  
      if (response.ok && data) {
        checkAuth()
      }
    } catch (error) {
      console.error('Error:', error); // Handle errors
    }
  };
  

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <form onSubmit={handleLogin} className='flex flex-col p-5 rounded-2xl justify-around gap-3'>
        <h1 className='text-5xl '>Login</h1>
        <InputFeild name="username" placeholder="username" type="text" />
        <InputFeild name="password" placeholder="password" type="password" />
        <button className='border rounded-xl' type='submit'>Login</button>
        <div className='flex gap-2'>
          <h1>Don't have an account?</h1>
          <Link to="/signup" className='hover:text-blue-800'>SignUp</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
