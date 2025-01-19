import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserSearch from './UserSearch';
import useFetch from '../fetchdata/useFetch';

const RightSidebar = () => {
  const [search, setSearch] = useState("");
  const [results,setResults] = useState([]);
  const [isLoading,setIsLoading] = useState(false)
  const [isError,setIsError] = useState(false)
  const [error,setError] = useState("")

  const handleChange = async (e) => {

    try{
    setResults([])  
    setSearch(e.target.value); 
    setIsLoading(true)
    const response = await fetch("http://localhost:3000/api/search",{
      method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({query:e.target.value}), 
    })
    const data = await response.json()
    
      setResults(data)
      
      console.log(data)

  }catch(error){
    setIsError(true)
    setError(error)
    console.log(error)
  }finally{
    setIsLoading(false)
  }
    
  }
  const {isLoading:isSugguestedUsersloading,data:sugguestedUsers}=useFetch("/api/users/sugguested")

  return (
    <div className="flex-col p-2 border-l hidden lg:block fixed right-0 top-0 h-full bg-black text-white">
      <div className="flex bg-slate-700 rounded-full p-2 mb-4">
        <MagnifyingGlassIcon className='h-6 w-6 text-white' />
        <input
          onChange={handleChange}
          value={search} // Make the input value controlled
          className="outline-0 pl-5 bg-inherit text-white w-full"
          type="text"
          placeholder="Search"
        />
      </div>
      {isLoading && <div>loading ...</div>}

        {isError && <div>{error}</div>}
        
      
      {!isLoading && results.length>0 && search.length>0 && (
        <div className="mt-4 p-2 rounded-xl border ">
          {
            results.map((result)=>{
             return <UserSearch key={result._id} user={result}/>
            })
            
          }
        </div>
      )}
  {isSugguestedUsersloading && <div>loading ...</div>}
  {search.length==0 && sugguestedUsers &&
      (
      <div className='mt-20'>
        <div>Sugguested Users</div>
        <div className="mt-4 p-2 rounded-xl border ">
          {
            sugguestedUsers.map((result)=>{
             return <UserSearch key={result._id} user={result}/>
            })
            
          }
        </div>
      </div>
      )
    }

    </div>
  );
}

export default RightSidebar;
