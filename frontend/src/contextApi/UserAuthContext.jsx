import { createContext, useMemo, useState } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
export const UserContext=createContext();

export default function UserContextProvider({children}){

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
        setUser
    
}),[userId]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}