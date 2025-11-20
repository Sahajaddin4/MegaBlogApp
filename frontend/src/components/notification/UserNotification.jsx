import React, { useState, useRef, useEffect, useContext } from 'react';
import { NotificationContext } from '../../contextApi/NotificationContextApi';
import { Link } from 'react-router-dom';
function UserNotification() {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const buttonRef = useRef(null);
    const { msg } = useContext(NotificationContext);
  
    const notificationTime=(time)=>{
        const date= new Date(time);
        return date.toLocaleString();
    }
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          panelRef.current &&
          !panelRef.current.contains(event.target) &&
          !buttonRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    return (
      <div className="relative inline-block">
        {/* Notification Button - Enhanced with subtle animations */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
        >
          <div className="relative">
            <i className="fa-regular fa-bell text-xl text-gray-600"></i>
            {msg.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full transform transition-transform hover:scale-110">
                {msg.length}
              </span>
            )}
          </div>
        </button>
  
        {/* Notification Panel - Enhanced design */}
        {isOpen && (
          <div
            ref={panelRef}
            className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-100 z-50 overflow-hidden transform transition-all duration-200 origin-top-right"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium text-gray-800">Notifications</h3>
              <span className="text-xs text-blue-500 cursor-pointer hover:underline">Mark all as read</span>
            </div>
            
            {/* Notification List */}
            <ul className="max-h-80 overflow-y-auto">
              {msg.length > 0 ? (
                msg.map((each, index) => (
                  <li 
                    key={index} 
                    className="p-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <i className="far fa-bell text-blue-500"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* <p className="text-sm font-medium text-gray-800 truncate">{each.author}</p> */}
                        <Link to={each.url} >
                        <p className="text-sm text-gray-600">{each.desc}</p></Link>
                        <p className="text-xs text-gray-400 mt-1">{index==0?'Just now':
                           notificationTime(each.createdAt)}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500">
                  <i className="far fa-bell-slash text-2xl mb-2"></i>
                  <p>No new notifications</p>
                </li>
              )}
            </ul>
            
            {/* Footer */}
            <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
              <button className="text-xs text-blue-500 hover:underline">View all notifications</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  

export default UserNotification