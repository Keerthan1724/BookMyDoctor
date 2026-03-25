import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import logo from "../assets/logo.png";

const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="mx-auto h-16 px-10 flex items-center justify-between bg-white dark:bg-cardDark border-b">
      <div className="flex items-center gap-3">
        <img src={logo} className="h-10" />

        {user?.role && (
          <span className="ml-2 text-xs border-gray-400 px-3 py-1 rounded-full border">
            {user.role}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="relative w-16 h-8 flex items-center bg-gray-300 dark:bg-bgDark rounded-full px-1 transition"
        >
          <FaSun className="text-white text-sm absolute left-2" />
          <FaMoon className="text-white text-sm absolute right-2" />

          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              theme === "dark" ? "translate-x-8" : "translate-x-0"
            }`}
          />
        </button>
        <button
          onClick={logout}
          className="px-5 py-2 rounded-full bg-primary text-white text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
