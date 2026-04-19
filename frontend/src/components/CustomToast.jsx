import { toast as hotToast } from "react-hot-toast";
import { Check, X, AlertTriangle, Info } from "lucide-react";

const styles = {
  success: {
    icon: <Check size={14} />,
    bg: "bg-green-400",
  },
  error: {
    icon: <X size={14} />,
    bg: "bg-red-400",
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    bg: "bg-yellow-400",
  },
  info: {
    icon: <Info size={14} />,
    bg: "bg-blue-400",
  },
};

export const toast = (message, type = "success") => {
  const { icon, bg } = styles[type];

  hotToast.custom((t) => (
    <div
      className={`flex items-center gap-2 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-md bg-white border border-gray-200 shadow-sm text-sm font-medium transition-all duration-200
      ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
    >
      <div
        className={`flex mr-2 text-white items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${bg}`}
      >
        {icon}
      </div>

      <span className="text-gray-800 break-words">{message}</span>
    </div>
  ));
};