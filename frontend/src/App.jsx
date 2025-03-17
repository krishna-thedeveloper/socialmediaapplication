import Home from "./pages/Home";
import LeftSidebar from "./components/LeftSidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RightSidebar from "./components/RightSidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Bottombar from "./components/Bottombar";
import { useEffect, useState } from "react";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import { useUser } from "./context/UserContext";
import ProfileUser from "./pages/ProfileUser";
import Profile from "./pages/Profile";
import React from "react";
import CampaignDetails from "./pages/CampaignDetails";
import ChatInterface from "./pages/Chat";

function App() {
  const {  isLoggedIn } = useUser()

  return (
    <BrowserRouter>
     <div className="text-white min-h-screen w-screen bg-black">
      {isLoggedIn && <LeftSidebar/>}
      <div className="flex min-h-screen w-screen ">
      
      
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={!isLoggedIn && <Login  />} />
        <Route path="/" element={isLoggedIn ? <Home />:<Signup />} />
        <Route path="/profile" element={isLoggedIn ? <Profile />:<Signup />} />
        <Route path="/messages" element={isLoggedIn ? <Messages /> :<Signup  />} />
        <Route path="/notifications" element={isLoggedIn ? <Notifications />:<Signup />} />
        <Route path="/profile/:username" element={isLoggedIn ? <ProfileUser />:<Signup />} />
        <Route path="/campaign/:id" element={<CampaignDetails />} />
        <Route path="/chat/:username" element={<ChatInterface />} />
      </Routes>
      
      
      </div>
      {isLoggedIn && <RightSidebar />}
      {isLoggedIn && < Bottombar />}
     
    </div>
    </BrowserRouter>
  );
}

export default App;
