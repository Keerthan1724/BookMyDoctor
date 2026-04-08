import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/appointmenthistory");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 bg-gray-50">
      
      {/* ICON SECTION */}
      <div className="relative flex items-center justify-center">
        
        {/* TICK */}
        <div className="absolute bg-green-100 rounded-full p-4">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* SPINNER RING */}
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-400 border-gray-200"></div>
      </div>

      {/* TEXT */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Payment Successful
        </h1>

        <p className="text-gray-500 mt-1">
          Your appointment payment done successfully
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;