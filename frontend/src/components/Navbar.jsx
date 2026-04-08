import { Link, NavLink, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import AccountPopup from "./AccountPopup";
import logo from "../assets/logo.png";

import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();

  const { user, logout, getAvatar, getAvatarColors } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Appointment", path: "/appointmenthistory", auth: true },
    { name: "Contact", path: "/contact" },
  ];

  const avatar = getAvatar();
  const avatarStyle = getAvatarColors(user?.username);

  useEffect(() => {
    const handleClickOutside = () => setOpen(false);

    if (open) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="w-full bg-cardLight dark:bg-gray-900 border-b border-borderLight dark:border-borderDark">
      <div className="w-full flex items-center justify-between px-4 md:px-20 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} className="h-12" />
        </Link>

        <div className="flex gap-8 text-lg font-medium">
          {navItems
            .filter((item) => {
              if (item.auth && user?.role !== "USER") return false;
              return true;
            })
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative pb-1 transition-colors duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-textLight dark:text-textDark"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {item.name}

                    <span
                      className={`absolute -bottom-2 left-0 w-full h-[2px] bg-primary transform
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${
          isActive
            ? "scale-x-100 opacity-100 origin-center"
            : "scale-x-0 opacity-0 origin-center"
        }`}
                    />
                  </span>
                )}
              </NavLink>
            ))}
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

          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: avatar ? "transparent" : avatarStyle.bg,
                  color: avatar ? "transparent" : avatarStyle.color,
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    className="w-full h-full rounded-full object-cover"
                    alt="profile"
                  />
                ) : (
                  user.username?.charAt(0).toUpperCase()
                )}
              </button>

              {open && (
                <AccountPopup
                  user={user}
                  logout={logout}
                  close={() => setOpen(false)}
                />
              )}
            </div>
          ) : (
            <Link
              to="/login"
              state={{ background: location.state?.background || location }}
              className="px-7 py-2 rounded-3xl bg-primary text-white text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
