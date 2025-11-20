import { createContext, useMemo, useState } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';
export const UserContext=createContext();

export default function UserContextProvider({children}){

    const socket = io(`http://localhost:3000`);
      
      socket.on('connect', () => {
        console.log('connected to socket server');
      });
    const token=Cookies.get('token') ;
    const name=token?jwtDecode(token).name:"";
    const userType=token?jwtDecode(token).userType:"";
    const userId=token?jwtDecode(token).id:"";
    
    const [isAuthenticated,setIsAuthencticated]=useState(token || "");
    const [user,setUser]=useState(name);
    const value=useMemo(()=>({
       
        isAuthenticated,
        setIsAuthencticated,
        user,
        userType,
        userId,
        setUser,
        socket
}),[userId]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}