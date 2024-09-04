import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Layout from "./components/layout/Layout";
import CreateBlog from "./components/pages/CreateBlog";
import Login from "./components/pages/auth_pages/Login";
import SignUp from "./components/pages/auth_pages/SignUp";
import Contact from "./components/pages/Contact";
import TestPage from "./components/pages/auth_pages/TestPage";

function App() {
  return (
    <div className="app bg-white rounded-lg max-w-[90vw] mx-auto p-4 min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="about" element={<About />} />
        <Route path="create-blog" element={<CreateBlog />}/>
        <Route path="user/login" element={<Login />} />
        <Route path="user/signup" element={<SignUp/>} />
        <Route path="admin-contact" element={<Contact />} />
        <Route path="/test" element={<TestPage/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
