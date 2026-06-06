import { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/media";
import {
  clearSession,
  clearStoredUser,
  getAccessToken,
  setStoredUser,
} from "../services/sessionService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      const res = await getProfile();

      setUser(res.data);
      setStoredUser(res.data);

      return res.data;
    } catch (err) {
      setUser(null);
      clearStoredUser();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();

      if (token) {
        await loadUser();
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    init();
  }, []);

  const logout = () => {
    clearSession();

    setUser(null);
    navigate("/");
  };

  const getAvatarColors = (username) => {
    const styles = [
      { bg: "#6c5ce7", color: "#fff" },
      { bg: "#0984e3", color: "#fff" },
      { bg: "#00b894", color: "#fff" },
      { bg: "#e84393", color: "#fff" },
      { bg: "#fdcb6e", color: "#2d3436" },
      { bg: "#d63031", color: "#fff" },
      { bg: "#fd79a8", color: "#fff" },
      { bg: "#00cec9", color: "#fff" },
      { bg: "#845ef7", color: "#fff" },
      { bg: "#3b82f6", color: "#fff" },
      { bg: "#16a34a", color: "#fff" },
      { bg: "#f59e0b", color: "#1f2937" },
      { bg: "#a855f7", color: "#fff" },
      { bg: "#38bdf8", color: "#1f2937" },
      { bg: "#f97316", color: "#fff" },
      { bg: "#10b981", color: "#fff" },
    ];

    if (!username) return styles[0];

    const hash = username
      .split("")
      .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0);

    return styles[hash % styles.length];
  };

  const getAvatar = () => {
    if (!user?.profile_image) return null;
    return getImageUrl(user.profile_image, { bustCache: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loadUser,
        getAvatarColors,
        getAvatar,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
