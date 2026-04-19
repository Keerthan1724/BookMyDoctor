import { useNavigate } from "react-router-dom";

const AuthModal = ({ children, closeTo = "/" }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-md dark:bg-black/55">
      <div className="surface-elevated relative w-full max-w-md p-8">
        <button
          onClick={() => navigate(closeTo)}
          className="absolute right-4 top-4 rounded-lg px-2 py-1 font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default AuthModal;
