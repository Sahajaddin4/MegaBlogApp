import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css';
import appLogo from "../../../assets/appLogo.jpeg";
function Navbar() {

  const [isLoggedIn,setIsLoggedIn]=useState(true);

  //handle logout
  function handleLogout(){
    setIsLoggedIn(false);
  }
  return (
    <div className="navbar">
      <nav>
        <div className="nav-items flex gap-6 mx-auto justify-between border-b">
          <div className="logo">
            <img src={appLogo} alt="logo" className="w-[50px] h-[40px]" />
          </div>
          <div className="btns flex gap-5">
          <NavLink to={"/create-blog"}

           className={``}
          >
              <button>New</button>
            </NavLink>
            <NavLink to={"/"}>
              <button>Home</button>
            </NavLink>
            <NavLink to={"/about"}>
              <button>About</button>
            </NavLink>
            <NavLink to={"/admin-contact"}>
              <button>Contact us</button>
            </NavLink>
          </div>
          {
            isLoggedIn?
            ( 
              
              <div className="logout-profile flex gap-5">
              <NavLink to={"/user/profile"}>
                  <button><i className="fa-duotone fa-solid fa-user"></i></button>
                </NavLink>
                <NavLink to={"#"}>
                  <button onClick={handleLogout}>logout</button>
                </NavLink>
              </div>
              ):(
              
          <div className="login-signup flex gap-5">
          <NavLink to={"/user/login"}>
              <button>Login</button>
            </NavLink>
            <NavLink to={"/user/signup"}>
              <button>Signup</button>
            </NavLink>
          </div>
              )
          }
        
         
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
