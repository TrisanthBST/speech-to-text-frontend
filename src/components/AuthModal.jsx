import { useState } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import {
  loginUser,
  registerUser,
  isEmailValid,
} from "../utils/auth";

const AuthModal = ({ isOpen, onClose, onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Basic client-side validations
      if (!isEmailValid(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (isLogin) {
        const result = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        onAuth(result);
      } else {
        if (!formData.name) {
          setError("Please enter your full name");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        const result = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        onAuth(result);
      }

      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-scale">
      <div className="glass-effect rounded-3xl p-8 w-full max-w-md mx-auto mx-4 animate-bounce-in border border-gray-600/40">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black gradient-text">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">


          {!isLogin && (
            <div className="animate-slide-in-left">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-12 bg-gray-800/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-blue-400"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="animate-slide-in-left animate-delay-100">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-12 bg-gray-800/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {true && (
            <div className="animate-slide-in-left animate-delay-200">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-12 pr-12 bg-gray-800/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-blue-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="animate-slide-in-left animate-delay-300">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-12 bg-gray-800/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-blue-400"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="animate-slide-in-up bg-red-900/30 border border-red-500/40 rounded-xl p-4">
              <p className="text-red-300 font-medium text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="animate-slide-in-up bg-green-900/30 border border-green-500/40 rounded-xl p-4">
              <p className="text-green-300 font-medium text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2 animate-slide-in-up animate-delay-500"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                {isLogin ? (
                  <LogIn className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
                <span>
                  {isLogin ? "Sign In" : "Create Account"}
                </span>
              </>
            )}
          </button>
        </form>

        {true && (
          <div className="mt-6 text-center animate-slide-in-up animate-delay-700">
            <p className="text-gray-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
