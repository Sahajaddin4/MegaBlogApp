import { createContext, useState } from "react";
import Cookies from 'js-cookie';
export const UserContext=createContext();

export default function UserContextProvider({children}){
    const [isAuthenticated,setIsAuthencticated]=useState(Cookies.get('token') || "");
    const [user,setUser]=useState('');
    const value={
       isAuthenticated,
       setIsAuthencticated,
       user,
       setUser
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}