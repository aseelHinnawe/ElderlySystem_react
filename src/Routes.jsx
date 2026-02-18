import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AuthLayout from "./layout/AuthLayout";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLayout from "./layout/AdminLayout";
import SponsorLayout from "./layout/SponsorLayout";
import NurseLayout from "./layout/NurseLayout";
import CompleteProfile from "./pages/nurse/completeProfile/CompleteProfile";
import HomeNurse from "./pages/nurse/homeNurse/HomeNurse";
import AdminHome from "./pages/admin/AdminHome/AdminHome";
import AdminProfile from "./pages/admin/AdminProfile/AdminProfile";
import AdminUsers from "./pages/admin/AdminUsers/AdminUsers";
import ProtectedRouter from "./component/protected/ProtectedRouter";
import AdminRequest from "./pages/admin/AdminRequest/AdminRequest";
import UserDetail from "./pages/admin/UserDetail/UserDetail";
import AdminElderlies from "./pages/admin/AdminElderlies/AdminElderlies";
import AdminElderliesRequest from "./pages/admin/AdminElderliesRequest/AdminElderliesRequest";
import AdminRooms from "./pages/admin/AdminRooms/AdminRooms";
import AddRoom from "./pages/admin/AddRoom/AddRoom";
import ElderlyDetails from "./pages/admin/ElderlyDetails/ElderlyDetails";
import RoomDetails from "./pages/admin/RoomDetails/RoomDetails";
import Activites from "./pages/admin/Activites/Activites";
import AddActivity from "./pages/admin/AddActivity/AddActivity";
import ActivityDetails from "./pages/admin/ActivityDetails/ActivityDetails";
import Donation from "./pages/admin/Donation/Donation";
import AddDonation from "./pages/admin/AddDonation/AddDonation";
import DonationDetails from "./pages/admin/DonationDetails/DonationDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children:[
        {
        index:true,
        element:<Home />
        },
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />
         },
      { 
        path: "/register",
        element: <Register /> 
      },
      {
        path:'/forgot-password',
        element:<ForgetPassword />
      },
      {
        path:'/reset-password',
        element:<ResetPassword />
      },
    ],
  },
  {
    path:'/Nurse',
    element: <NurseLayout />,
    children: [
      {
        index: true,
        element: <HomeNurse />,
      },
      {
        path:'completeProfile',
        element: <CompleteProfile />,
      },
    ]
  },
  {
    path:'/Admin',
    element: 
    <ProtectedRouter>
     <AdminLayout />
     </ProtectedRouter>,
    children: [
    {
      index: true,
      element: <AdminHome />,
    },
    {
      path: 'users',
      element: <AdminUsers />,
    },
    {
      path: 'profile',
      element: <AdminProfile />,
    },
    {
      path: 'requests',
      element: <AdminRequest />,
    },
    {
      path: "user/:id",      
      element: <UserDetail />,
    },
    {
        path: "elderlies",
        element: <AdminElderlies />,
      },
      {
        path: "elderliesRequest",
        element: <AdminElderliesRequest />,
      },
      {
      path: "rooms",
      element: <AdminRooms />,
      },
      {
        path: "add-room",
        element: <AddRoom />,
      },
      {
      path: "room/:id",
      element: <RoomDetails />,
      },
      
      {
        path: "elderly/:id",
        element: <ElderlyDetails />,
      },
      {
        path: "activites",
        element: <Activites />,
      },
      {
        path: "add-activity",
        element: <AddActivity />,
      },
      {
        path: "activity/:id",
        element: <ActivityDetails />,
      },
      {
        path: "Donations",
        element: <Donation />,
      },
      {
        path: "add-Donation",
        element: <AddDonation />,
      },
       {
        path: "Donation/:id",
        element: <DonationDetails />,
      },
  ],
  },
  {
    path:'/Sponsor',
    element: <SponsorLayout/>,
  },
]);

export default router;