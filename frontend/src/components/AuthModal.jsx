import { useNavigate, useLocation } from "react-router-dom";

const AuthModal = ({ children, closeTo = "/" }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      <div className="relative w-full max-w-md bg-cardLight dark:bg-cardDark rounded-xl shadow-lg p-8">
        <button
          onClick={() => navigate(closeTo)}
          className="absolute right-4 top-4 px-2 py-1 font-medium rounded-lg text-gray-400 hover:text-black hover:bg-gray-200"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default AuthModal;
