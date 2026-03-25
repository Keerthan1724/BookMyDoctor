import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { FiUser, FiLogOut } from "react-icons/fi";

const AccountPopup = ({ user, logout, close }) => {
  const { getAvatar, getAvatarColors } = useContext(AuthContext);

  const avatar = getAvatar();
  const avatarStyle = getAvatarColors(user.username);

  return (
    <div className="absolute right-0 mt-3 w-56 bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-xl shadow-xl p-4 z-50">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden"
          style={{
            backgroundColor: avatar ? undefined : avatarStyle.bg,
            color: avatar ? undefined : avatarStyle.color,
          }}
        >
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" />
          ) : (
            user.username?.charAt(0).toUpperCase()
          )}
        </div>

        <p className="text-lg font-semibold">{user.username}</p>
      </div>

      <div className="border-t border-borderLight dark:border-borderDark mb-3"></div>

      <div className="flex flex-col gap-2">
        <Link
          to="/profile"
          onClick={close}
          className="flex items-center py-2 px-3 rounded-lg hover:bg-primary hover:text-white transition"
        >
          <FiUser size={20} />

          <span className="flex-1 text-center text-sm font-medium">
            View Profile
          </span>
        </Link>

        <button
          onClick={() => {
            logout();
            close();
          }}
          className="flex items-center py-2 px-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-600 hover:text-red-600 dark:hover:text-white transition w-full"
        >
          <FiLogOut size={20} />

          <span className="flex-1 text-center text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AccountPopup;
