import { Link, NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import AccountPopup from "./AccountPopup";
import Avatar from "./Avatar";
import logo from "../assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, getAvatar } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Appointment", path: "/appointmenthistory", auth: true },
    { name: "Contact", path: "/contact" },
  ];

  const avatar = getAvatar();
  useEffect(() => {
    const handleClickOutside = () => setOpen(false);

    if (open) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-borderLight bg-white transition-colors duration-300 dark:border-borderDark dark:bg-gray-900">
      <div className="flex w-full items-center justify-between px-4 py-3 md:px-16 lg:px-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} className="h-12" alt="BookMyDoctor" />
        </Link>

        <div className="hidden gap-6 lg:gap-8 text-base lg:text-lg font-medium md:flex">
          {navItems
            .filter((item) => !(item.auth && user?.role !== "USER"))
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
                      className={`absolute -bottom-2 left-0 h-[2px] w-full bg-primary transition-all duration-300 ${
                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      }`}
                    />
                  </span>
                )}
              </NavLink>
            ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative flex h-8 w-16 items-center rounded-full bg-gray-300 px-1 transition dark:bg-bgDark"
          >
            <FaSun className="absolute left-2 text-sm text-white" />
            <FaMoon className="absolute right-2 text-sm text-white" />
            <div
              className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
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
                className="overflow-hidden rounded-full"
              >
                <Avatar
                  name={user.username}
                  image={avatar || user.profile_image}
                  alt="profile"
                  className="h-9 w-9"
                  textClassName="text-sm font-semibold"
                />
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
              className="hidden rounded-3xl bg-primary px-7 py-2 text-sm text-white md:inline-flex"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-borderLight text-textLight transition hover:bg-gray-100 md:hidden dark:border-borderDark dark:text-textDark dark:hover:bg-gray-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-borderLight bg-white px-4 py-4 md:hidden dark:border-borderDark dark:bg-gray-900">
          <div className="flex flex-col gap-2 text-base font-medium">
            {navItems
              .filter((item) => !(item.auth && user?.role !== "USER"))
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-textLight hover:bg-gray-100 dark:text-textDark dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

            {!user && (
              <Link
                to="/login"
                state={{ background: location.state?.background || location }}
                className="rounded-xl bg-primary px-4 py-3 text-center text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
