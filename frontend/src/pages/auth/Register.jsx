import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import AuthModal from "../../components/AuthModal";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "username", placeholder: "Username", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password", toggle: true },
    { name: "confirmPassword", placeholder: "Confirm Password", type: "password" },
  ];

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Za-z]/.test(pwd)) return "Password must contain letters also";
    if (!/[0-9]/.test(pwd)) return "Password must contain numbers also";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) return alert("Name cannot be empty");
    if (!form.email) return alert("Email cannot be empty");
    if (!validateEmail(form.email)) return alert("Enter a valid email");

    const pwdError = validatePassword(form.password);
    if (pwdError) return alert(pwdError);
    if (form.password !== form.confirmPassword) return alert("Passwords do not match");

    try {
      setLoading(true);
      const res = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      alert(res.data.message || "Registration successful");
      navigate("/login", { state: { background: location.state?.background || location } });
    } catch (error) {
      console.error("Register Error:", error);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal>
      <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {fields.map((field) => {
          if (field.toggle) {
            return (
              <div key={field.name} className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={field.placeholder}
                  className="border rounded-lg p-3 w-full pr-10 bg-transparent"
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </span>
              </div>
            );
          } else {
            // normal input
            return (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="border rounded-lg p-3 bg-transparent"
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              />
            );
          }
        })}

        <button
          className="bg-primary text-white py-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center border-t pt-4 flex justify-center">
        <p className="text-sm text-gray-600 pr-2 dark:text-gray-200">
          Already have an account ?
        </p>

        <Link
          to="/login"
          state={{ background: location.state?.background || location }}
          className="text-primary text-sm hover:underline"
        >
          Login
        </Link>
      </div>
    </AuthModal>
  );
};

export default Register;