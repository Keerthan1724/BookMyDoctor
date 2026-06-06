import { useContext } from "react";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import logo from "../assets/logo.png";

const AdminNavbar = ({ onMenuToggle }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 md:px-10 theme-border border-b bg-white dark:bg-bgDark dark:border-gray-500">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full theme-border border text-textLight dark:text-textDark lg:hidden"
        >
          <FaBars size={16} />
        </button>

        <div className="flex items-center gap-3 select-none">
          <img
            src={logo}
            className="h-11 w-11 object-contain"
            alt="BookMyDoctor"
          />

          <h1 className="hidden md:block text-xl lg:text-2xl font-semibold tracking-wide">
            <span className="text-slate-900 dark:text-slate-100">Book</span>
            <span className="text-teal-600 font-bold">My</span>
            <span className="text-blue-600 font-bold">Doctor</span>
          </h1>
        </div>

        {user?.role && (
          <span className="ml-2 hidden sm:inline-flex border px-3 py-1 text-xs theme-text-muted bg-slate-100/80 border-slate-300/80 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-200 rounded-full">
            {user.role}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex h-8 w-14 sm:w-16 items-center rounded-full bg-slate-300 dark:bg-bgDark px-1 transition"
        >
          <FaSun className="absolute left-2 text-xs sm:text-sm text-white" />
          <FaMoon className="absolute right-2 text-xs sm:text-sm text-white" />

          <div
            className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
              theme === "dark"
                ? "translate-x-6 sm:translate-x-8"
                : "translate-x-0"
            }`}
          />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="hidden lg:inline-flex px-5 py-2 text-sm rounded-full bg-primary text-white hover:bg-primaryDark transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
