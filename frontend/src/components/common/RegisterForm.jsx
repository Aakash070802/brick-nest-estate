import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useMemo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const previewUrl = useMemo(() => {
    if (!formData.avatar) return "/default-user.png";
    return URL.createObjectURL(formData.avatar);
  }, [formData.avatar]);

  useEffect(() => {
    return () => {
      if (formData.avatar) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, formData.avatar]);

  // VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
      toast.error("Username is required");
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      toast.error("Invalid email format");
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      toast.error("Password is required");
    } else if (!/^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(formData.password)) {
      newErrors.password =
        "Min 6 chars, 1 uppercase, 1 special character required";
      toast.error("Min 6 chars, 1 uppercase, 1 special character required");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
      toast.error("Confirm your password");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    handleSubmit(e);
  };

  // CLEAR ERROR ON CHANGE (better UX)
  const handleFieldChange = (e) => {
    handleChange(e);

    if (errors[e.target.id]) {
      setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
    }
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
          onChange={(e) => {
            handleFieldChange(e);
            fileRef.current.value = null; // FIX same file re-upload
          }}
          hidden
        />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="text-sm text-[var(--color-foreground)]"
          >
            Username <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleFieldChange}
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
          <label
            htmlFor="email"
            className="text-sm text-[var(--color-foreground)]"
          >
            Email <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleFieldChange}
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
          <label
            htmlFor="password"
            className="text-sm text-[var(--color-foreground)]"
          >
            Password <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            placeholder="Enter Password"
            onChange={handleFieldChange}
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
          <label
            htmlFor="confirmPassword"
            className="text-sm text-[var(--color-foreground)]"
          >
            Confirm Password{" "}
            <span className="text-[var(--color-destructive)]">*</span>
          </label>

          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword || ""}
            placeholder="Re-enter Password"
            onChange={handleFieldChange}
            className="p-3 rounded-xl w-full 
            bg-[var(--color-card)] 
            border border-[var(--color-border)] 
            text-[var(--color-foreground)] 
            outline-none 
            focus:ring-2 focus:ring-[var(--color-primary)] 
            transition"
          />

          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-[var(--color-muted-foreground)]"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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

      <p className="mt-4 text-sm text-[var(--color-muted-foreground)] text-center md:text-left">
        Already have an account?{" "}
        <Link to="/login" className="text-[var(--color-primary)]">
          Sign in
        </Link>
      </p>

      {error && (
        <p className="mt-3 text-sm text-[var(--color-destructive)] text-center">
          {error}
        </p>
      )}
    </motion.div>
  );
};

export default RegisterForm;
