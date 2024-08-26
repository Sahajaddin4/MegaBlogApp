import React from 'react'
import Navbar from './navbar/Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='layout'>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default Layout