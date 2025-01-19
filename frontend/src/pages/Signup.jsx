import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputFeild from '../components/InputFeild';
import useFetch from '../fetchdata/useFetch';
import { useUser } from '../context/UserContext';

const Signup = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState(null);
  const {login,setIsLoggedIn} = useUser()
  const handleSignup = async (e) => {
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
  
  
      if (data) {
        login(data); // Update login state
        navigate('/'); // Redirect to homepage
      }
    } catch (error) {
      console.error('Error:', error); // Handle errors
    }
  };


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
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center text-white">
      <form onSubmit={handleSignup} className="flex flex-col p-5 rounded-2xl justify-around gap-3">
        <h1 className="text-6xl">Signup</h1>
        <InputFeild name="fullName" placeholder="Name" type="text" />
        <InputFeild name="email" placeholder="Email" type="email" />
        <InputFeild name="username" placeholder="Username" type="text" />
        <InputFeild name="password" placeholder="Password" type="password" />
        <button className="border rounded-xl" type="submit">
          Signup
        </button>
        <div className="flex gap-2">
          <h1>Already have an account?</h1>
          <Link to="/login" className="hover:text-blue-800">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
