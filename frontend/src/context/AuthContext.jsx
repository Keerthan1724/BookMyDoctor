import { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      const res = await getProfile();

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      return res.data;
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

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
    ];

    if (!username) return styles[0];

    return styles[username.charCodeAt(0) % styles.length];
  };

  const getAvatar = () => {
  if (!user) return null;

  if (user.profile_image) {
    if (user.profile_image.startsWith("http")) {
      return `${user.profile_image}?t=${Date.now()}`;
    }
    return `http://localhost:8000${user.profile_image}?t=${Date.now()}`;
  }

  return null;
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
