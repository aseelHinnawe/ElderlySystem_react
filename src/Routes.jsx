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
  ],
  },
  {
    path:'/Sponsor',
    element: <SponsorLayout/>,
  },
]);

export default router;