import React, { createContext, useState } from 'react'
import axios from 'axios';
export const NotificationContext=createContext();


export default function NotificationContextApi({children}) {
         async function getAdminNotification(){
             try {
                  let url=`/api/blog/api/notification/admin-notification`;
                  const response=await axios.get(url);
                  if(response.status===200){
                     setMsg([...response.data.data]);
                  }
              } catch (error) {
                console.log(`unable to get new notification.`);
                
              } 
         }
  const[msg,setMsg]=useState([]);
  const value={
    msg,
    getAdminNotification,
    setMsg
  }
  return (
       <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  )
}

 