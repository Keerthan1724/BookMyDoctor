import { Link } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import Avatar from "./Avatar";

const AccountPopup = ({ user, logout, close }) => {
  return (
    <div className="surface-elevated absolute right-2 sm:right-0 mt-3 w-52 sm:w-56 p-3 sm:p-4 z-50">

      <div className="mb-4 flex flex-col items-center gap-2">

        <Avatar
          name={user.username}
          image={user.profile_image}
          alt="avatar"
          className="h-14 w-14 sm:h-16 sm:w-16 text-xl sm:text-2xl font-bold"
          textClassName="text-xl sm:text-2xl font-bold"
        />

        <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">
          {user.username}
        </p>

      </div>

      <div className="theme-border mb-3 border-t" />

      <div className="flex flex-col gap-2">

        <Link
          to="/profile"
          onClick={close}
          className="flex items-center rounded-lg sm:rounded-xl px-3 py-2 transition hover:bg-primary hover:text-white dark:hover:bg-primary"
        >
          <FiUser size={18} className="sm:size-5" />
          <span className="flex-1 text-center text-sm font-medium">
            View Profile
          </span>
        </Link>

        <button
          onClick={() => {
            logout();
            close();
          }}
          className="flex w-full items-center rounded-lg sm:rounded-xl px-3 py-2 transition hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-300"
        >
          <FiLogOut size={18} className="sm:size-5" />
          <span className="flex-1 text-center text-sm font-medium">
            Logout
          </span>
        </button>

      </div>
    </div>
  );
};

export default AccountPopup;
