import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginBgImg from "../../assets/login-bg.png";
import { loginUser, loginWithGoogle } from "../../services/authService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/features/userSlice";
import LoginForm from "../../components/common/LoginForm";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [googleLoading, setGoogleLoading] = useState(false);

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

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return dispatch(loginFailure("Invalid email format"));
    }

    try {
      dispatch(loginStart());

      const data = await loginUser(formData);

      dispatch(loginSuccess(data));
      toast.success("Welcome");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
      dispatch(loginFailure(null));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const data = await loginWithGoogle();

      dispatch(loginSuccess(data));
      toast.success("Welcome");
      navigate("/");
    } catch (err) {
      if (err.message !== "Google login cancelled") {
        dispatch(loginFailure(err.message));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg)">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-225 rounded-2xl overflow-hidden"
      >
        <LoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleGoogleLogin={handleGoogleLogin}
          loading={loading}
          googleLoading={googleLoading}
          error={error}
        />

        <div className="w-1/2 hidden md:block">
          <img src={loginBgImg} className="h-full w-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
