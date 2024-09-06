import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import eye from "../../../assets/eye.png";
import crossEye from "../../../assets/crossEye.png";
import { toast } from "react-toastify";
import axios from "axios";
import isEmail from 'validator/lib/isEmail';
import { UserContext } from "../../../contextApi/userAuthContext";
function SignUp() {
  const [passwordType, setPasswordType] = useState("password");
  const [cPasswordType, setCpasswordType] = useState("password");
  const [userData, setUserData] = useState({
    name:"",
    email: "",
    password: "",
    confirmPassword:""
  });
  const{toastStyle}=useContext(UserContext);
  // Function to toggle password visibility
  function togglePasswordVisibility() {
    setPasswordType((prevType) => {
      return prevType === "password" ? "text" : "password";
    });
  }

  ///Function to toggle confrim password visibilty
  function toggleConfirmPasswordVisibility() {
    setCpasswordType((prevType) => {
      return prevType === "password" ? "text" : "password";
    });
  }
  // Function to handle changes in the input fields
  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  //data send to database function
const createAccount=async (e)=>{
 
    e.preventDefault();
    if(userData.email==="" || userData.name==="" || userData.password==="" || userData.confirmPassword===""){
      toast.error('Please fill all details!',toastStyle);
    }
    else if( userData.password!==userData.confirmPassword)
    {
        toast.error('Password not matched!',toastStyle);
    }
    else{
      if(isEmail(userData.email)){

        try {
         let res=await axios.post('/api/blog/api/user/signup',userData);
        
         
        toast.success(res.data.message);
        } catch (error) {
         console.log(error);
         toast.error('Failed to create account!',toastStyle);
        }
        
     }
     else{
      toast.error("Please follow email format..",toastStyle)
     }
     
      }
      setUserData({
        name:"",
        email: "",
        password: "",
        confirmPassword:""
      })
}

  return (
    <div className="signup w-[30em] mt-20 mx-auto rounded-lg shadow-md border px-6 py-2 m-2">
      <div className="heading text-center mb-5">
        <h1 className="text-2xl font-bold">Create Account</h1>
      </div>
      <div className="form">
        <form className="flex flex-col gap-5">

          {/* username */}
          <div className="username flex flex-col gap-2 justify-start ">
          <label htmlFor="username">UserName:</label>
            <input
              type="text"
              name="name"
              id="username"
              onChange={handleChange}
              value={userData.name}
              required 
              className="border-2  hover:border-blue-400 py-2 rounded w-full"
            />
          </div>
          {/* Email input field */}
          <div className="email flex flex-col gap-2 justify-start">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              required 
              value={userData.email}
              onChange={handleChange}
              className="border-2  hover:border-blue-400 py-2 rounded w-full"
            />
          </div>

          {/* Password input field with toggle icon */}
          <div className="password flex flex-col gap-2 justify-start">
            <label htmlFor="password">Password:</label>
            <div className="relative border-2 hover:border-blue-400 py-2 rounded w-full">
              {/* Password input field */}
              <input
                type={passwordType}
                name="password"
                id="password"
                required 
                value={userData.password}
                onChange={handleChange}
                className="w-full border-none outline-none pr-10"
              />

              {/* Toggle icon to show/hide password */}
              <div>
                {passwordType === "text" ? (
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

          {/* Confirm Password input field with toggle icon */}
          <div className="confirmPassword flex flex-col gap-2 justify-start">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="relative border-2 hover:border-blue-400 py-2 rounded w-full">
              {/*confirm  Password input field */}
              <input
                type={cPasswordType}
                name="confirmPassword"
                id="confirmPassword"
                required 
                onChange={handleChange}
                value={userData.confirmPassword}
                className="w-full border-none outline-none pr-10"
              />

              {/* Toggle icon to show/hide password */}
              <div>
                {cPasswordType === "text" ? (
                  <img
                    src={crossEye}
                    alt="Hide password"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 bottom-2 w-[25px] h-[20px]"
                  />
                ) : (
                  <img
                    src={eye}
                    alt="Show password"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 bottom-2 w-[25px] h-[20px]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="btn text-center mt-5">
            <button
              type="submit"
              className="py-2 px-4 rounded w-[60%] mx-auto bg-blue-600 text-white"
              onClick={createAccount}
            >
              Create
            </button>
          </div>
        </form>

        {/* Links to login and forgot password */}
        <div className="link flex justify-between items-center mt-5">
          <div className="login-route-link">
            <Link
              to="/user/login"
              className="text-blue-500 hover:text-blue-800 hover:shadow-md"
            >
              <p>Already have account?</p>
            </Link>
          </div>
          <div className="forgot-password">
            <Link
              to="#"
              className="text-green-500 hover:text-green-800 hover:shadow-md"
            >
              <p>Forgot password?</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
