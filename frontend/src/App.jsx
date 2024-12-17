import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Layout from "./components/layout/Layout";
import CreateBlog from "./components/pages/CreateBlog";
import Login from "./components/pages/auth_pages/Login";
import SignUp from "./components/pages/auth_pages/SignUp";
import Contact from "./components/pages/Contact";
import Admin from "./components/pages/admin/Admin";
import UserDashboard from "./components/pages/user/UserDashboard";

import ShowBlog from "./components/pages/card/ShowBlog";

function App() {
  return (
    <div className="app bg-white rounded-lg  mx-auto p-4 min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="admin" element={<Admin />}/>
        <Route path="user" element={<UserDashboard />}/>
        <Route path="about" element={<About />} />
        <Route path="create-blog" element={<CreateBlog />}/>
        <Route path="user/login" element={<Login />} />
        <Route path="user/signup" element={<SignUp/>} />
        <Route path="admin-contact" element={<Contact />} />
        <Route path="blog/:id" element={<ShowBlog />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
