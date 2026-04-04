import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import loginBgImg from "../assets/login-bg.png";
import axios from "axios";
import { motion } from "framer-motion";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/features/userSlice";
import { loginWithGoogle } from "../components/OAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(loginFailure("All fields are required"));
    }

    try {
      dispatch(loginStart());

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );

      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      dispatch(loginStart());

      const data = await loginWithGoogle();

      dispatch(loginSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(
        loginFailure(err.response?.data?.message || "Google login failed"),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg)">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-225 rounded-2xl overflow-hidden shadow-lg"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* LEFT FORM */}
        <div className="w-1/2 bg-(--color-surface) p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-(--color-text)">
            Welcome Back
          </h2>
          <p className="text-(--color-text-muted) mb-6">
            Sign in to your account
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-xl bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 rounded-xl bg-(--color-card) border border-(--color-border) text-(--color-text) outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              disabled={loading}
              className="p-3 rounded-xl text-white font-semibold cursor-pointer"
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading ? "Loading..." : "Login"}
            </motion.button>
          </form>
          <div className="my-4 text-center text-(--color-text-muted)">or</div>

          <div className="flex justify-center w-full">
            <motion.button
              disabled={loading}
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 w-full max-w-xs px-6 py-3 
               border border-gray-300 rounded-xl bg-white 
               shadow-sm hover:shadow-md hover:bg-gray-50 
               transition-all duration-200 cursor-pointer"
            >
              {/* Google Logo */}
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />

              {/* Text */}
              <span className="text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </motion.button>
          </div>

          <p className="mt-4 text-sm text-(--color-text-muted)">
            Don’t have an account?{" "}
            <Link to="/register" className="text-(--color-primary)">
              Sign up
            </Link>
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-1/2 hidden md:block">
          <img
            src={loginBgImg}
            alt="building"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
