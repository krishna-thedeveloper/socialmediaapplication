import React, { useState } from 'react'

const NewPost = ({setNewPostShow}) => {
    const [postContent,setPostContent]=useState("")

    const handleChange = (e) => {
        setPostContent(e.target.value);
      };
    const handlePostSubmit = async (postContent)=>{
        const data ={"text":postContent}
        const response = await fetch("http://localhost:3000/api/posts/create",{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data), 
          })
          if(response.ok){
            console.log("posted successfully!")
            alert("Posted successfully")
          }
    }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (postContent.trim()) {
          handlePostSubmit(postContent);
          setPostContent(""); // Clear the text after submission
          setNewPostShow(false); // Close the modal
        }
      };
  return (
    <div className="fixed bottom-0 left-0 w-full  bg-black bg-opacity-50 flex justify-center ">
    <div className="bg-black p-6 rounded-lg w-80">
      <h2 className="text-xl font-semibold mb-4">What's on your mind?</h2>
      <textarea
        value={postContent}
        onChange={handleChange}
        placeholder="Write something..."
        className="w-full bg-inherit p-3 mb-4 border border-gray-300 rounded-md"
        rows="5"
      />
      <div className="flex justify-between items-center">
        <button
          onClick={() => setNewPostShow(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Post
        </button>
      </div>
    </div>
  </div>
  )
}

export default NewPost
