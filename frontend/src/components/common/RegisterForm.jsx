import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";

const RegisterForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
}) => {
  const fileRef = useRef(null);

  const previewUrl = formData.avatar
    ? URL.createObjectURL(formData.avatar)
    : "/default-user.png";

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-1/2 bg-(--color-surface) p-10 flex flex-col justify-center"
    >
      <h2 className="text-3xl font-bold mb-2 text-(--color-text)">
        Create Account
      </h2>
      <p className="text-(--color-text-muted) mb-6">Sign up to get started</p>

      {/* 🔥 AVATAR PREVIEW */}
      <div className="flex justify-center mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-(--color-border)"
          onClick={() => fileRef.current.click()}
        >
          <img
            src={previewUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* hidden input */}
        <input
          type="file"
          id="avatar"
          accept="image/*"
          ref={fileRef}
          onChange={handleChange}
          hidden
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="p-3 rounded-xl bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none focus:ring-2 focus:ring-(--color-primary)"
        />

        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded-xl bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none focus:ring-2 focus:ring-(--color-primary)"
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="p-3 rounded-xl bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none focus:ring-2 focus:ring-(--color-primary)"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="p-3 rounded-xl text-white font-semibold"
          style={{ background: "var(--gradient-primary)" }}
        >
          {loading ? "Creating Account..." : "Register"}
        </motion.button>
      </form>

      <p className="mt-4 text-sm text-(--color-text-muted)">
        Already have an account?{" "}
        <Link to="/login" className="text-(--color-primary)">
          Sign in
        </Link>
      </p>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </motion.div>
  );
};

export default RegisterForm;
