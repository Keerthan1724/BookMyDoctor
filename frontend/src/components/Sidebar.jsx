import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";

const Sidebar = ({ items, mobileOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          bg-white dark:bg-bgDark fixed lg:static top-0 left-0 z-50 
          h-screen lg:h-auto lg:min-h-full w-72
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          border-r dark:border-gray-700 flex flex-col
        `}
      >
        {/* Profile */}
        <div className="flex flex-col items-center py-6 sm:py-8 border-b theme-border">
          <Avatar
            name={user?.username}
            image={user?.profile_image}
            className="w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-primary shadow-md"
            textClassName="text-3xl sm:text-4xl font-semibold"
          />

          <p className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-center">
            {user?.username}
          </p>
        </div>

        {/* Menu */}
        <div className="flex flex-col mt-4 sm:mt-6 flex-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3 text-sm transition ${
                    isActive
                      ? "bg-primary/10 border-r-4 border-primary text-primary"
                      : "theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </div>
        <div className="mt-auto pt-6 lg:hidden">
          <button
            onClick={logout}
            className="w-full bg-primary px-4 py-3 text-center text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
