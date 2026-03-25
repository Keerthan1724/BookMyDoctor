import {
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineCloseCircle,
  AiOutlineQuestionCircle,
} from "react-icons/ai";

const iconMap = {
  success: <AiOutlineCheckCircle size={60} className="text-green-500" />,
  error: <AiOutlineCloseCircle size={60} className="text-red-500" />,
  warning: <AiOutlineWarning size={60} className="text-yellow-500" />,
  confirm: <AiOutlineQuestionCircle size={60} className="text-blue-500" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-[90%] max-w-md p-6 text-center">

        <div className="flex justify-center mb-4">
          {iconMap[type]}
        </div>

        {title && (
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
        )}

        <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
          {message}
        </p>

        <div className="flex justify-center gap-3">
          {secondaryBtnText && (
            <button
              onClick={onSecondary || onClose}
              className="px-4 py-2 rounded-lg border"
            >
              {secondaryBtnText}
            </button>
          )}

          <button
            onClick={onPrimary || onClose}
            className={`px-4 py-2 rounded-lg text-white
              ${type === "error" && "bg-red-500"}
              ${type === "warning" && "bg-red-500"}
              ${type === "success" && "bg-green-500"}
              ${type === "confirm" && "bg-primary"}
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