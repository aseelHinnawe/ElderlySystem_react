import React from 'react'
import { Outlet } from 'react-router'
import SponsorNavbar from '../component/navbar/SponsorNavbar'

export default function SponsorLayout() {
  return (
    <>
    <SponsorNavbar />
    <Outlet />
    </>
    
  )
}
