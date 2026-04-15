import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleGoogleLogin,
  loading,
  googleLoading,
  error,
  onForgotPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // Prevent empty submit + spam
  const onSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    setLocalError("");
    handleSubmit(e);
  };

  return (
    <div className="w-full md:w-1/2 bg-[var(--color-background)] p-6 sm:p-8 md:p-10 flex flex-col justify-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-foreground)]">
        Welcome Back
      </h2>

      <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] mb-6">
        Sign in to your account
      </p>

      {/* Error on top (better visibility) */}
      {(error || localError) && (
        <p className="mb-4 text-sm text-[var(--color-destructive)] text-center">
          {error || localError}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="text-sm text-[var(--color-foreground)]"
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Email"
            id="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => {
              setLocalError("");
              handleChange(e);
            }}
            className="p-3 rounded-xl w-full 
            bg-[var(--color-card)] 
            border border-[var(--color-border)] 
            text-[var(--color-foreground)] 
            outline-none 
            focus:ring-2 focus:ring-[var(--color-primary)] 
            transition"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="text-sm text-[var(--color-foreground)]"
          >
            Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => {
              setLocalError("");
              handleChange(e);
            }}
            placeholder="Password"
            className="p-3 pr-10 rounded-xl w-full 
            bg-[var(--color-card)] 
            border border-[var(--color-border)] 
            text-[var(--color-foreground)] 
            outline-none 
            focus:ring-2 focus:ring-[var(--color-primary)] 
            transition"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11.25 -translate-y-1/2 cursor-pointer text-[var(--color-muted-foreground)]"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="p-3 rounded-xl font-semibold text-[var(--color-primary-foreground)] 
          bg-[var(--color-primary)] 
          disabled:opacity-70 transition"
        >
          {loading ? "Loading..." : "Login"}
        </motion.button>
      </form>

      {/* ✅ Accessible button */}
      <button
        onClick={onForgotPassword}
        className="mt-3 text-center text-sm 
        text-[var(--color-primary)] 
        cursor-pointer hover:underline"
      >
        Forgot Password?
      </button>

      {/* Divider */}
      <div className="my-4 text-center text-[var(--color-muted-foreground)]">
        or
      </div>

      <GoogleButton onClick={handleGoogleLogin} loading={googleLoading} />

      {/* Register */}
      <p className="mt-4 text-sm text-[var(--color-muted-foreground)] text-center md:text-left">
        Don't have an account?{" "}
        <Link to="/register" className="text-[var(--color-primary)]">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
