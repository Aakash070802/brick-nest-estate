import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  return (
    <div className="w-full md:w-1/2 bg-[var(--color-background)] p-6 sm:p-8 md:p-10 flex flex-col justify-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-foreground)]">
        Welcome Back
      </h2>

      <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] mb-6">
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded-xl w-full 
          bg-[var(--color-card)] 
          border border-[var(--color-border)] 
          text-[var(--color-foreground)] 
          outline-none 
          focus:ring-2 focus:ring-[var(--color-primary)] 
          transition"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={handleChange}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-muted-foreground)]"
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

      {/* Forgot Password */}
      <p
        onClick={onForgotPassword}
        className="mt-3 text-center text-sm 
        text-[var(--color-primary)] 
        cursor-pointer hover:underline"
      >
        Forgot Password?
      </p>

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

      {/* Error (you were ignoring this prop completely) */}
      {error && (
        <p className="mt-3 text-sm text-[var(--color-destructive)] text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default LoginForm;
