import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginBgImg from "../../assets/login-bg.png";
import {
  loginUser,
  loginWithGoogle,
  requestRestore,
  verifyRestore,
  forgotPasswordRequest,
  verifyForgotOtp,
  resetPassword,
} from "../../services/authService";
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

  // Restore Account State
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

      dispatch(loginSuccess(data.data));
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

      dispatch(loginSuccess(data.data));
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

      dispatch(loginSuccess(data.data));
      toast.success("Account restored");

      setShowRestoreModal(false);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleForgotRequest = async () => {
    try {
      await forgotPasswordRequest(forgotEmail);
      toast.success("OTP sent");
      setForgotStep(2);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyForgotOtp = async () => {
    try {
      await verifyForgotOtp(forgotEmail, forgotOtp);
      toast.success("OTP verified");
      setForgotStep(3);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(forgotEmail, newPassword);
      toast.success("Password updated");

      setShowForgotModal(false);
      setForgotStep(1);

      // optional: auto fill email in login
      setFormData((prev) => ({ ...prev, email: forgotEmail }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-(--color-bg) px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row"
        >
          <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleGoogleLogin={handleGoogleLogin}
            loading={loading}
            googleLoading={googleLoading}
            error={error}
            onForgotPassword={() => setShowForgotModal(true)}
          />

          <div className="hidden md:block md:w-1/2">
            <img src={loginBgImg} className="h-full w-full object-cover" />
          </div>
        </motion.div>

        {showRestoreModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-(--color-surface) p-6 rounded-2xl shadow-xl"
            >
              <h2 className="text-lg font-semibold mb-2 text-(--color-text)">
                Restore Account
              </h2>

              <p className="text-sm text-(--color-text-muted) mb-5">
                Your account is deactivated. Enter OTP to restore it.
              </p>

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
                    className="mt-4 w-full py-3 rounded-xl text-white font-medium"
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
                    className="mt-4 w-full py-3 rounded-xl text-white font-medium"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Verify & Restore
                  </button>
                </>
              )}

              <button
                onClick={() => setShowRestoreModal(false)}
                className="mt-4 text-sm text-red-400 hover:underline"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}

        {showForgotModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-(--color-surface) p-6 rounded-2xl shadow-xl"
            >
              <h2 className="text-lg font-semibold mb-2 text-(--color-text)">
                Forgot Password
              </h2>

              <p className="text-sm text-(--color-text-muted) mb-5">
                Reset your password in a few steps
              </p>

              {/* STEP 1 */}
              {forgotStep === 1 && (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
                  />

                  <button
                    onClick={handleForgotRequest}
                    className="mt-4 w-full py-3 rounded-xl text-white font-medium"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Send OTP
                  </button>
                </>
              )}

              {/* STEP 2 */}
              {forgotStep === 2 && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
                  />

                  <button
                    onClick={handleVerifyForgotOtp}
                    className="mt-4 w-full py-3 rounded-xl text-white font-medium"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {/* STEP 3 */}
              {forgotStep === 3 && (
                <>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 rounded-xl bg-(--color-card) border border-(--color-border)"
                  />

                  <button
                    onClick={handleResetPassword}
                    className="mt-4 w-full py-3 rounded-xl text-white font-medium"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Reset Password
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStep(1);
                }}
                className="mt-4 text-sm text-red-400 hover:underline"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
