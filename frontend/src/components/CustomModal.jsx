import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineQuestionCircle,
  AiOutlineWarning,
} from "react-icons/ai";

const iconMap = {
  success: <AiOutlineCheckCircle size={48} className="text-green-500" />,
  error: <AiOutlineCloseCircle size={48} className="text-red-500" />,
  warning: <AiOutlineWarning size={48} className="text-yellow-500" />,
  confirm: <AiOutlineQuestionCircle size={48} className="text-blue-500" />,
};

const CustomModal = ({
  isOpen,
  type = "confirm",
  title,
  message,
  primaryBtnText = "OK",
  secondaryBtnText,
  onPrimary,
  onSecondary,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md dark:bg-black/60 p-4">
      
      <div className="surface-elevated w-full max-w-md p-5 sm:p-6 text-center rounded-xl">

        <div className="mb-4 flex justify-center">
          {iconMap[type]}
        </div>

        {title && (
          <h2 className="mb-2 text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
        )}

        <p className="mb-5 sm:mb-6 whitespace-pre-line text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {message}
        </p>

        <div className="flex flex-col-reverse sm:flex-row justify-center gap-2 sm:gap-3">

          {secondaryBtnText && (
            <button
              onClick={onSecondary || onClose}
              className="w-full sm:w-auto rounded-xl border border-slate-200 px-4 py-2 text-sm sm:text-base text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {secondaryBtnText}
            </button>
          )}

          <button
            onClick={onPrimary || onClose}
            className={`w-full sm:w-auto rounded-xl px-4 py-2 text-sm sm:text-base text-white transition
              ${type === "error" && "bg-red-500 hover:bg-red-600"}
              ${type === "warning" && "bg-red-500 hover:bg-red-600"}
              ${type === "success" && "bg-green-500 hover:bg-green-600"}
              ${type === "confirm" && "bg-primary hover:bg-primaryDark"}
            `}
          >
            {primaryBtnText}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CustomModal;