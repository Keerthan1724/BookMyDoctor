import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigationType } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  const prevKey = useRef(location.key);
  const navigationType = useNavigationType();

  useEffect(() => {
    if (loading) return;

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== location.pathname
    ) {
      prevKey.current = location.key;
      return;
    }

    const isRestrictedRole = user?.role === "ADMIN" || user?.role === "DOCTOR";

    if (
      location.pathname === "/" &&
      isRestrictedRole &&
      (navigationType === "POP" || prevKey.current !== location.key)
    ) {
      logout();
    }

    prevKey.current = location.key;
  }, [location, user, loading]);

  if (loading) return null;

  return children;
};

export default PublicRoute;
