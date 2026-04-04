import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GoogleButton from "./GoogleButton";

const LoginForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleGoogleLogin,
  loading,
  googleLoading,
  error,
}) => {
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
          className="p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          disabled={loading}
          className="p-3 rounded-xl text-white font-semibold"
          style={{ background: "var(--gradient-primary)" }}
        >
          {loading ? "Loading..." : "Login"}
        </motion.button>
      </form>

      <div className="my-4 text-center text-(--color-text-muted)">or</div>

      <GoogleButton onClick={handleGoogleLogin} loading={googleLoading} />

      <p className="mt-4 text-sm text-(--color-text-muted)">
        Don't have an account?{" "}
        <Link to="/register" className="text-(--color-primary)">
          Sign up
        </Link>
      </p>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default LoginForm;
