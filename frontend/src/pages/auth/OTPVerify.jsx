import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../../components/AuthModal";
import { verifyOTP, sendOTP } from "../../services/authService";
import { toast } from "../../components/CustomToast";

const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const expiresAt = location.state?.expiresAt;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);

  const inputs = useRef([]);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timer);

        toast("OTP expired. Please request a new OTP.", "warning");

        navigate("/forgot-password", {
          state: {
            email,
            background: location.state?.background || location,
          },
        });
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (!finalOtp) {
      toast("OTP cannot be empty", "error");
      return;
    }

    if (finalOtp.length !== 6) {
      toast("OTP must be 6 digits", "error");
      return;
    }

    try {
      const response = await verifyOTP({
        email,
        otp: finalOtp,
      });

      if (response?.data?.error) {
        toast(response.data.error, "error");
        return;
      }

      toast("OTP verified successfully", "success");

      navigate("/reset-password", {
        state: {
          email,
          background: location.state?.background || location,
        },
      });
    } catch (error) {
      console.error("OTP Verification Error:", error);

      if (error.response?.data?.message) {
        toast(error.response.data.message, "error");
      } else {
        toast("Invalid OTP", "error");
      }
    }
  };

  const handleResend = async () => {
    try {
      await sendOTP({ email });

      toast("New OTP sent", "success");

      const newExpiry = Date.now() + 60000;

      navigate("/verify-otp", {
        state: {
          email,
          expiresAt: newExpiry,
          background: location.state?.background || location,
        },
      });
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast("Failed to resend OTP", "error");
    }
  };

  return (
    <AuthModal>
      <h2 className="text-2xl font-semibold text-center mb-2">Verify OTP</h2>

      <p className="text-sm text-gray-500 text-center mb-6">
        Enter the 6 digit code sent to your email
      </p>

      <form
        onSubmit={handleVerify}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg border rounded-lg focus:ring-2 focus:ring-primary bg-transparent"
            />
          ))}
        </div>

        <p className="text-sm text-gray-500">OTP expires in {timeLeft}s</p>

        <button className="bg-primary text-white w-full py-3 rounded-lg">
          Verify
        </button>
      </form>
    </AuthModal>
  );
};

export default OTPVerify;
