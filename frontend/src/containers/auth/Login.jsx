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
import { requestRestore, verifyRestore } from "../../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [googleLoading, setGoogleLoading] = useState(false);

  // Restore Account State
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

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
      if (err.message === "ACCOUNT_DEACTIVATED") {
        setShowRestoreModal(true);
      } else {
        toast.error(err.message);
      }
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
      if (err.message === "ACCOUNT_DEACTIVATED") {
        setShowRestoreModal(true);
      } else {
        toast.error(err.message);
      }
      if (err.message !== "Google login cancelled") {
        dispatch(loginFailure(err.message));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    try {
      await requestRestore(formData.email);
      toast.success("OTP sent");
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const data = await verifyRestore(formData.email, otp);

      dispatch(loginSuccess(data));
      toast.success("Account restored");

      setShowRestoreModal(false);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
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

      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-(--color-surface) p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-(--color-text)">
              Restore Account
            </h2>

            <p className="text-sm text-(--color-text-muted) mb-4">
              Your account is deactivated. Enter OTP to restore it.
            </p>

            {/* STEP CONTROL */}
            {step === 1 ? (
              <>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
                />

                <button
                  onClick={handleRequestOtp}
                  className="mt-4 w-full p-3 rounded-xl text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
                />

                <button
                  onClick={handleVerifyOtp}
                  className="mt-4 w-full p-3 rounded-xl text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Verify & Restore
                </button>
              </>
            )}

            <button
              onClick={() => setShowRestoreModal(false)}
              className="mt-3 text-sm text-red-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
