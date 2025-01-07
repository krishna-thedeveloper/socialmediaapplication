import Home from "./pages/Home";
import Sidebar from "./pages/LeftSidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sugguestbar from "./pages/RightSidebar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Bottombar from "./pages/Bottombar";

let islogin=true;
function App() {
  return (

     <div className="text-white h-screen w-screen bg-black">
      <div className="flex h-screen w-screen ">
      {islogin && <Sidebar />}
      <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={islogin ? <Home />:<Signup />} />
      </Routes>
      </BrowserRouter>
      {islogin && <Sugguestbar />}
      </div>
      
      <Bottombar />
     </div>
    
  );
}

export default App;
