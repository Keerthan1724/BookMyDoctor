import { useState, useEffect } from "react";
import AuthModal from "../../components/AuthModal";
import { sendOTP } from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { customModal } from "../../services/modalService";
import { toast } from "../../components/CustomToast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [isResend, setIsResend] = useState(!!location.state?.email);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOTP = async () => {
    if (!email) {
      toast("Email field cannot be empty", "error");
      return;
    }
    if (!validateEmail(email)) {
      toast("Enter a valid email address", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await sendOTP({ email });

      const expiresAt = Date.now() + 60000;

      navigate("/verify-otp", {
        state: {
          email,
          expiresAt,
          background: location.state?.background || location,
        },
      });

      if (response?.data?.message) {
        toast(response.data.message, "success");
        return;
      }

      toast(`OTP ${isResend ? "resent" : "sent"} to your email`, "success");
    } catch (error) {
      console.error("Send OTP Error:", error);

      const data = error.response?.data;

      const role = data?.role || "your account";

      const backendError =
        data?.non_field_errors?.[0] || data?.email?.[0] || data?.message;

      if (data?.role_restricted) {
        customModal({
          type: "error",
          title: "Access Restricted",
          message: `You are logged in as ${role}. ${role} accounts cannot reset password using OTP.\n\nPlease contact the system administrator for assistance.`,
          primaryBtnText: "Okay",
        });
      } else {
        toast(backendError || "Something went wrong", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.email) {
      setIsResend(true);
    }
  }, [location.state]);

  return (
    <AuthModal>
      <h2 className="text-2xl font-semibold text-center mb-2">
        Forgot Password
      </h2>

      <p className="text-sm text-gray-500 text-center mb-6">
        Enter your registered email
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendOTP();
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="border rounded-lg p-3 bg-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-primary text-white py-3 rounded-lg"
        >
          {loading ? "Sending..." : isResend ? "Resend OTP" : "Send OTP"}
        </button>
      </form>
    </AuthModal>
  );
};

export default ForgotPassword;
