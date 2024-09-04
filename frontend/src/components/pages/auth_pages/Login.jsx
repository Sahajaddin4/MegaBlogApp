import React, { useContext, useState } from 'react';
import eye from '../../../assets/eye.png';
import crossEye from '../../../assets/crossEye.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserContext } from '../../../contextApi/userAuthContext';
function Login() {
  const [passwordType, setPasswordType] = useState('password');
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const navigate=useNavigate();
    const {setIsAuthencticated,setUser,user}=useContext(UserContext);
  // Function to toggle password visibility
  function togglePasswordVisibility() {
    setPasswordType(prevType => {
      return prevType === 'password' ? 'text' : 'password';
    });
  }

  // Function to handle changes in the input fields
  function handleChange(e) {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  const login =async(e)=>{
    try{
      e.preventDefault();

      let res=await axios.post('/api/blog/api/user/login',userData);
      //  Cookies.set("token",res.data.token);
       
        setIsAuthencticated(Cookies.get('token'));
        setUser(res.data.user);
       console.log(Cookies.get('token'));
        
        
       toast.success(res.data.message);
       navigate('/');
      }
    catch(e){
      console.log(e);
        toast.error('Failed to login account!');
    }
    finally{
      setUserData({
         email: '',
    password: ''
      })
    }
  }

  return (
    <div className="login w-[30em] mt-20 h-[20em] mx-auto rounded-lg shadow-2xl border px-4 py-2 m-2">
      <div className="heading text-center mb-5">
        <h1 className="text-2xl font-bold">Login</h1>
      </div>
      <div className="form">
        <form className="flex flex-col gap-5">

          {/* Email input field */}
          <div className="email flex gap-2 items-center">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              onChange={handleChange}
              value={userData.email}
              className="border-2 ml-7 hover:border-blue-400 py-2 rounded w-full"
            />
          </div>

          {/* Password input field with toggle icon */}
          <div className="password flex gap-2 items-center">
            <label htmlFor="password">Password:</label>
            <div className="relative border-2 hover:border-blue-400 py-2 rounded w-full">

              {/* Password input field */}
              <input
                type={passwordType}
                name="password"
                id="password"
                onChange={handleChange}
                value={userData.password}
                className="w-full border-none outline-none pr-10"
              />

              {/* Toggle icon to show/hide password */}
              <div>
                {passwordType === 'text' ? (
                  <img
                    src={crossEye}
                    alt="Hide password"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 bottom-2 w-[25px] h-[20px]"
                  />
                ) : (
                  <img
                    src={eye}
                    alt="Show password"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 bottom-2 w-[25px] h-[20px]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="btn text-center mt-5">
            <button
            onClick={login}
              type="submit"
              className="py-2 px-4 rounded w-[60%] mx-auto bg-blue-600 text-white"
            >
              Login
            </button>
          </div>
        </form>

            {/* Links to login and forgot password */}
            <div className="link flex justify-between items-center mt-5">
          <div className="signup-route-link">
            <Link to="/user/signup" className="text-blue-500 hover:text-blue-800 hover:shadow-md">
              <p>Don't have account? create account.</p>
            </Link>
          </div>
          <div className="forgot-password">
            <Link to="#" className="text-green-500 hover:text-green-800 hover:shadow-md">
              <p>Forgot password?</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
