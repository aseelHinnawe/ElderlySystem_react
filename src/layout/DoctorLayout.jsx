import { Outlet } from 'react-router'
import DoctorNavbar from '../component/navbar/DoctorNavbar.jsx'


export default function DoctorLayout() {
  return (
    <>
    <DoctorNavbar />
    <Outlet />
    </>
  )
}

