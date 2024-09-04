import { createContext, useState } from "react";

export const UserContext=createContext();

export default function UserContextProvider({children}){
    const [isAuthenticated,setIsAuthencticated]=useState("");
    const [user,setUser]=useState('');
    const value={
       isAuthenticated,
       setIsAuthencticated,
       user,
       setUser
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}