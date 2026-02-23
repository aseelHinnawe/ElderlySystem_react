import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
export default function AuthProtectedRoute({ children }) {
  const userToken = localStorage.getItem("token");
  if (!userToken) return children;
  try {
    const decodedToken = jwtDecode(userToken);
    const roleClaim =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const role = decodedToken[roleClaim];
    const profileCompleted = decodedToken?.profileCompleted === "true";
    if (role === "Admin") {
      return <Navigate to={"/Admin"} replace />;
    } else if (role === "Sponsor") {
      console.log(profileCompleted);
      if (profileCompleted === true) {
        return <Navigate to={"/Sponsor"} replace />;
      } else {
        return <Navigate to={"/Sponsor/Verfiy-Link"} replace />;
      }
    } else if (role === "Nurse") {
      console.log(profileCompleted);

      if (profileCompleted === true) {
        return <Navigate to={"/Nurse"} replace />;
      } else {
        return <Navigate to={"/Nurse/completeProfile"} replace />;
      }
    }
  } catch (e) {
    localStorage.removeItem("token");
    return children;
  }
}