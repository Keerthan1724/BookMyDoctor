import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import AuthModal from "../../components/AuthModal";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Za-z]/.test(pwd)) return "Password must contain letters also";
    if (!/[0-9]/.test(pwd)) return "Password must contain numbers also";
    return null;
  };

  const handleReset = async (e) => {
    e.preventDefault();

    const pwdError = validatePassword(password);
    if (pwdError) {
      alert(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        email,
        new_password: password,
        confirm_password: confirmPassword,
      });

      if (response?.data?.error) {
        alert(response.data.error);
        return;
      }

      alert("Password reset successful");
      navigate("/login", {
        state: {
          background: location.state?.background || location,
        },
      });
    } catch (err) {
      console.error("Reset Password Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal>
      <h2 className="text-2xl text-center font-semibold mb-4">Reset Password</h2>

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="border rounded-lg p-3 w-full pr-10 bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </span>
        </div>

        <input
          type="password"
          placeholder="Confirm password"
          className="border rounded-lg p-3 bg-transparent"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-primary text-white py-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthModal>
  );
};

export default ResetPassword;
