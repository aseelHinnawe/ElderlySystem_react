import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRouter({ children }) {
  const location = useLocation();
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const check = () => setHasToken(!!localStorage.getItem("token"));

    window.addEventListener("storage", check);

    const id = setInterval(check, 300);

    return () => {
      window.removeEventListener("storage", check);
      clearInterval(id);
    };
  }, []);

  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}