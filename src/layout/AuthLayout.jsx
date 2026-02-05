import React from 'react'
import { Outlet } from 'react-router'
import AuthNavbar from '../component/navbar/AuthNavbar'

export default function AuthLayout() {
  return (
    <>
     <AuthNavbar />
     <Outlet />
    </>
     
  )
}
