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
    if (role === "Admin") {
      return <Navigate to={"/Admin"} replace />;
    } else if (role === "FirstSponsor" || role === "SecondSponsor") {
      return <Navigate to={"/Sponsor"} replace />;
    } else if (role === "Nurse") {
      return <Navigate to={"/Nurse"} replace />;
    }
  } catch (e) {
    localStorage.removeItem("token");
    return children;
  }
}