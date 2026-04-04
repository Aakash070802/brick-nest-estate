import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const RegisterForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
}) => {
  const fileRef = useRef(null);

  const [errors, setErrors] = useState({});

  const previewUrl = formData.avatar
    ? URL.createObjectURL(formData.avatar)
    : "/default-user.png";

  // 🔥 VALIDATION LOGIC
  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(formData.password)) {
      newErrors.password =
        "Min 6 chars, 1 uppercase, 1 special character required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 🔥 WRAP SUBMIT
  const onSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    handleSubmit(e); // pass to container
  };

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

      {/* AVATAR */}
      <div className="flex justify-center mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-(--color-border)"
          onClick={() => fileRef.current.click()}
        >
          <img
            src={previewUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <input
          type="file"
          id="avatar"
          accept="image/*"
          ref={fileRef}
          onChange={handleChange}
          hidden
        />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* USERNAME */}
        <div>
          <label className="text-sm text-(--color-text)">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 rounded-xl w-full bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-(--color-text)">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-xl w-full bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-(--color-text)">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-xl w-full bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

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
