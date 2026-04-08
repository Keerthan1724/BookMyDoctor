import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../../components/AuthModal";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "../../components/CustomToast";

const Login = () => {
  const { loadUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      toast("Email field cannot be empty", "error");
      return;
    }

    if (!validateEmail(email)) {
      toast("Enter a valid email", "error");
      return;
    }

    if (!password) {
      toast("Password cannot be empty", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });

      sessionStorage.setItem("accessToken", res.data.access);
      sessionStorage.setItem("refreshToken", res.data.refresh);

      toast(res.data.message || "Login successful", "success");

      const loggedInUser = await loadUser();

      if (loggedInUser?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (loggedInUser?.role === "DOCTOR") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);

      toast(error.response?.data?.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal>
      <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg p-3 bg-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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

        <button
          className="bg-primary text-white py-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-3 text-right">
        <Link
          to="/forgot-password"
          state={{
            background: location.state?.background ?? { pathname: "/" },
          }}
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <div className="mt-6 text-center border-t pt-4 flex justify-center">
        <p className="text-sm text-gray-600 pr-2 dark:text-gray-200">
          Don’t have an account ?
        </p>

        <Link
          to="/register"
          state={{
            background: location.state?.background || location,
          }}
          className="text-primary text-sm hover:underline"
        >
          Register
        </Link>
      </div>
    </AuthModal>
  );
};

export default Login;
