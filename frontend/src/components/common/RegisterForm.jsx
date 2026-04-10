import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
}) => {
  const fileRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const previewUrl = formData.avatar
    ? URL.createObjectURL(formData.avatar)
    : "/default-user.png";

  // ✅ VALIDATION
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

    // ✅ CONFIRM PASSWORD
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    handleSubmit(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full md:w-1/2 
      bg-[var(--color-background)] 
      p-5 sm:p-8 md:p-10 
      flex flex-col justify-center"
    >
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-foreground)]">
        Create Account
      </h2>

      <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] mb-6">
        Sign up to get started
      </p>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer border-2 border-[var(--color-border)]"
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
        {/* Username */}
        <div>
          <label className="text-sm text-[var(--color-foreground)]">
            Username <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 rounded-xl w-full 
            bg-[var(--color-card)] 
            border border-[var(--color-border)] 
            text-[var(--color-foreground)] 
            outline-none 
            focus:ring-2 focus:ring-[var(--color-primary)] 
            transition"
          />

          {errors.username && (
            <p className="text-[var(--color-destructive)] text-xs mt-1">
              {errors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-[var(--color-foreground)]">
            Email <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type="email"
            id="email"
            placeholder="Enter Email"
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

          {errors.email && (
            <p className="text-[var(--color-destructive)] text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="text-sm text-[var(--color-foreground)]">
            Password <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            placeholder="Enter Password"
            onChange={handleChange}
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
            className="absolute right-3 top-[38px] cursor-pointer text-[var(--color-muted-foreground)]"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {errors.password && (
            <p className="text-[var(--color-destructive)] text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="text-sm text-[var(--color-foreground)]">
            Confirm Password{" "}
            <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword || ""}
            placeholder="Re-enter Password"
            onChange={handleChange}
            className="p-3 rounded-xl w-full 
            bg-[var(--color-card)] 
            border border-[var(--color-border)] 
            text-[var(--color-foreground)] 
            outline-none 
            focus:ring-2 focus:ring-[var(--color-primary)] 
            transition"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-[var(--color-muted-foreground)]"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.confirmPassword && (
            <p className="text-[var(--color-destructive)] text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="p-3 rounded-xl font-semibold 
          text-[var(--color-primary-foreground)] 
          bg-[var(--color-primary)] 
          disabled:opacity-70 transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </motion.button>
      </form>

      {/* Footer */}
      <p className="mt-4 text-sm text-[var(--color-muted-foreground)] text-center md:text-left">
        Already have an account?{" "}
        <Link to="/login" className="text-[var(--color-primary)]">
          Sign in
        </Link>
      </p>

      {/* Global Error */}
      {error && (
        <p className="mt-3 text-sm text-[var(--color-destructive)] text-center">
          {error}
        </p>
      )}
    </motion.div>
  );
};

export default RegisterForm;
