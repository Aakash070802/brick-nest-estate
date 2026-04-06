import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

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
    <div className="w-1/2 bg-(--color-surface) p-10 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-2 text-(--color-text)">
        Welcome Back
      </h2>
      <p className="text-(--color-text-muted) mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 pr-10 rounded-xl w-full bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-3 pr-10 rounded-xl w-full bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-(--color-text-muted)"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          disabled={loading}
          className="p-3 rounded-xl text-white font-semibold"
          style={{ background: "var(--gradient-primary)" }}
        >
          {loading ? "Loading..." : "Login"}
        </motion.button>
      </form>
      <p
        onClick={onForgotPassword}
        className="mt-2 text-center text-sm text-blue-500 cursor-pointer"
      >
        Forgot Password?
      </p>

      <div className="my-4 text-center text-(--color-text-muted)">or</div>

      <GoogleButton onClick={handleGoogleLogin} loading={googleLoading} />

      <p className="mt-4 text-sm text-(--color-text-muted)">
        Don't have an account?{" "}
        <Link to="/register" className="text-(--color-primary)">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
