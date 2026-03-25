import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const Sidebar = ({ items }) => {
  const { user, getAvatarColors, getAvatar } = useContext(AuthContext);

  const avatarStyle = getAvatarColors(user?.username);

  return (
    <div className="w-72 h-screen sticky top-0 bg-white border-r flex flex-col">
      <div className="flex flex-col items-center py-8 border-b">
        <div
          className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-5xl font-semibold ring-2 ring-primary shadow-md"
          style={{
            backgroundColor: !user?.profile_image ? avatarStyle.bg : "",
            color: avatarStyle.color,
          }}
        >
          {user?.profile_image ? (
            <img
  src={getAvatar() || ""}
  className="w-full h-full object-cover"
/>
          ) : (
            user?.username?.charAt(0).toUpperCase()
          )}
        </div>

        <p className="mt-4 text-lg font-semibold">{user?.username}</p>
      </div>

      <div className="flex flex-col mt-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 text-sm transition ${isActive ? "bg-blue-50 border-r-4 border-primary text-primary" : "text-gray-600 hover:bg-gray-100"}`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
