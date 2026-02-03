import React from 'react'
import Navbar from '../component/navbar/Navbar'
import Footer from '../component/footer/Footer'
import { Container } from '@mui/material'
import { Outlet } from 'react-router'

export default function MainLayout() {
  return (
    <>
      <Navbar />
        <Outlet/>
      <Footer />
    </>
  )
}
