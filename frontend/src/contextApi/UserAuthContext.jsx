import { createContext, useState } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
export const UserContext=createContext();

export default function UserContextProvider({children}){

    const token=Cookies.get('token') ;
    const name=token?jwtDecode(token).name:"";
    
    const [isAuthenticated,setIsAuthencticated]=useState(token || "");
    const [user,setUser]=useState(name);
    const value={
       isAuthenticated,
       setIsAuthencticated,
       user,
       setUser
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}