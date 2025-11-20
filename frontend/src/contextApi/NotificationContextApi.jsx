import React, { createContext, useContext, useState } from 'react'
import axios from 'axios';
import { UserContext } from './UserAuthContext';
export const NotificationContext=createContext();


export default function NotificationContextApi({children}) {
         const baseUrl = '/api/blog/api/notification'
         const {userId,userType} = useContext(UserContext);

         async function getAdminNotification(){
             try {
                  let url=`${baseUrl}/admin-notification`;
                  const response=await axios.get(url);
                  if(response.status===200){
                    if(userType === "admin"){
                      setMsg([...response.data.data]);
                    }
                  }
              } catch (error) {
                console.log(`unable to get new notification.`);
                
              } 
         }

        //  async function getUserSpecificNotification(postId){
        //     try {
        //          let url = `${baseUrl}/user-notification`;
        //          const response = await axios.get(url,{
        //           params:{
        //             userId:userId,
        //             postId:postId
        //           }
        //          });
        //          if(response.status === 200){
        //             if(userType = "user"){
        //               setMsg([...response.data.data])
        //             }
        //          }
        //     } catch (error) {
        //       console.log("Failed to fetch Notification");
        //       console.error(error)
        //     }
        //  }
  const[msg,setMsg]=useState([]);
  const value={
    msg,
    getAdminNotification,
    setMsg,
    // getUserSpecificNotification
  }
  return (
       <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  )
}

 