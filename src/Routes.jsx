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
import HomeNurse from "./pages/nurse/homeNurse/HomeNurse";
import AdminHome from "./pages/admin/AdminHome/AdminHome";
import AdminProfile from "./pages/admin/AdminProfile/AdminProfile";
import AdminUsers from "./pages/admin/AdminUsers/AdminUsers";
import ProtectedRouter from "./component/protected/ProtectedRouter";
import AdminRequest from "./pages/admin/AdminRequest/AdminRequest";
import UserDetail from "./pages/admin/UserDetail/UserDetail";
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
import ElderlyStays from "./pages/admin/ElderlyStays/ElderlyStays";
import AuthProtectedRoute from "./component/protected/AuthProtectedRoute.jsx";
import Elderlies from "./pages/nurse/Elderlies/Elderlies.jsx";
import ElderlyDetail from "./pages/nurse/ElderlyDetail/ElderlyDetail.jsx";
import AddCheckList from "./pages/nurse/AddCheckList/AddCheckList.jsx";
import ElderlyCheckList from "./pages/nurse/ElderlyCheckList/ElderlyCheckList.jsx";
import NurseProfile from "./pages/nurse/NurseProfile/NurseProfile.jsx";
import NurseShifts from "./pages/admin/NurseShifts/NurseShifts.jsx";
import AddShifts from "./pages/admin/AddShifts/AddShifts.jsx";
import MyShifts from "./pages/nurse/MyShifts/MyShifts.jsx";
import AddElderlyMeal from "./pages/nurse/AddElderlyMeal/AddElderlyMeal.jsx";
import GetElderlyMeal from "./pages/nurse/GetElderlyMeal/GetElderlyMeal.jsx";
import ContactMessage from "./pages/admin/ContactMessage/ContactMessage.jsx";
import AddMedicine from "./pages/nurse/AddMedicine/AddMedicine.jsx";
import ElderlyMedicine from "./pages/nurse/ElderlyMedicine/ElderlyMedicine.jsx";
import AddMediciation from "./pages/nurse/AddMediciation/AddMediciation.jsx";
import GetMedication from "./pages/nurse/GetMedication/GetMedication.jsx";
import SponsorHome from "./pages/sponsor/SponsorHome/SponsorHome.jsx";
import ElderlyDetailsSponsor from "./pages/sponsor/ElderlyDetailsSponsor/ElderlyDetailsSponsor.jsx";
import SponsorProfile from "./pages/sponsor/SponsorProfile/SponsorProfile.jsx";
import MedicineStatus from "./pages/sponsor/MedicineStatus/MedicineStatus.jsx";
import DailyFollow from "./pages/sponsor/DailyFollow/DailyFollow.jsx";
import DoctorLayout from "./layout/DoctorLayout.jsx";
import ElderlyDoctor from "./pages/Doctor/ElderlyDoctor/ElderlyDoctor.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile/DoctorProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <AuthProtectedRoute>
            <Home />
          </AuthProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <AuthProtectedRoute>
            <ForgetPassword />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <AuthProtectedRoute>
            <ResetPassword />
          </AuthProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/Nurse",
    element: (
      <ProtectedRouter>
        <NurseLayout />
      </ProtectedRouter>
    ),
    children: [
      {
        index: true,
        element: <HomeNurse />,
      },
      {
        path: "profile",
        element: <NurseProfile />,
      },
      {
        path: "MyShifts",
        element: <MyShifts />,
      },
      {
        path: "elderlies",
        element: <Elderlies />,
      },
      {
        path: "elderly/:id",
        element: <ElderlyDetail />,
      },
      {
        path: "elderly/add-checklist",
        element: <AddCheckList />,
      },
      {
        path: "elderly/checklist",
        element: <ElderlyCheckList />,
      },
      {
        path: "AddMeal",
        element: <AddElderlyMeal />,
      },
      {
        path: "Elderly-Meal",
        element: <GetElderlyMeal />,
      },
      {
        path: "Add-Medicine",
        element: <AddMedicine />,
      },
      {
        path: "Elderly-Medicine",
        element: <ElderlyMedicine />,
      },
      {
        path: "Elderly-Medication",
        element: <AddMediciation />,
      },
      {
        path: "Medication",
        element: <GetMedication />,
      },    
    ],
  },
  {
    path: "/Admin",
    element: (
      <ProtectedRouter>
        <AdminLayout />
      </ProtectedRouter>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
      {
        path: "requests",
        element: <AdminRequest />,
      },
      {
        path: "user/:id",
        element: <UserDetail />,
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
      {
        path: "elderlyStay",
        element: <ElderlyStays />,
      },
      {
        path: "NurseShifts",
        element: <NurseShifts />,
      },
      {
        path: "AddShifts",
        element: <AddShifts />,
      },
      {
        path : "ContactMessage",
        element : <ContactMessage />
      },
    ],
  },
  {
    path: "/Sponsor",
    element: (
      <ProtectedRouter>
        <SponsorLayout />
      </ProtectedRouter>
    ),
    children: [
      {
        index: true,
        element: <ElderlyDetailsSponsor />,
      },
      {
        path: "Sponsor-Profile",
        element: <SponsorProfile />,
      },
      {
        path: "MedicineStatus",
        element: <MedicineStatus />,
      },
      {
        path: "DailyFollow",
        element: <DailyFollow />,
      },
    ]
    
  },
  {
    path: "/Doctor",
    element: (
      <ProtectedRouter>
        <DoctorLayout />
      </ProtectedRouter>
    ),
    children: [
      {
        index: true,
        element: <ElderlyDoctor />,
      },
      {
        path: "Doctor-Profile",
        element: <DoctorProfile />,
      },
    ],
  },
]);

export default router;