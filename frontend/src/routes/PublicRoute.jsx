import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  const prevKey = useRef(location.key);

  useEffect(() => {
    if (loading) return;

    if (prevKey.current !== location.key) {
      if (
        location.pathname === "/" &&
        (user?.role === "ADMIN" || user?.role === "DOCTOR")
      ) {
        logout();
      }
    }

    prevKey.current = location.key;
  }, [location, user, loading]);

  if (loading) return null;

  return children;
};

export default PublicRoute;
