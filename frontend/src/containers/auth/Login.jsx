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
import Modal from "../../components/common/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalAnim = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 40,
    transition: { duration: 0.2 },
  },
};

const Login = () => {
  /**
   * @description State variables for login form, Google login loading state, account restoration flow, and forgot password flow
   */
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  /**
   * @description State variables for forgot password flow, including modal visibility, step tracking, form inputs, and error handling
   */
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  /**
   * @description Redux dispatch and navigation hooks for handling authentication flow and page redirection
   */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  /**
   * @function handleChange
   * @description Updates form data state on input change
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /**
   * @function handleSubmit
   * @description Validates form data and handles login flow, including error handling for account deactivation
   */
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

  /**
   * @function handleGoogleLogin
   * @description Handles Google login flow, including error handling for account deactivation and cancellation
   */
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

  /**
   * @function handleRequestOtp
   * @description Sends OTP request for account restoration and moves to OTP verification step
   */
  const handleRequestOtp = async () => {
    try {
      await requestRestore(formData.email);
      toast.success("OTP sent");
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    }
  };

  /**
   * @function handleVerifyOtp
   * @description Verifies OTP for account restoration and logs in the user
   */
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

  /**
   * @function handleForgotRequest
   * @description Sends forgot password request and moves to OTP verification step
   */
  const handleForgotRequest = async () => {
    try {
      await forgotPasswordRequest(forgotEmail);
      toast.success("OTP sent");
      setForgotStep(2);
    } catch (err) {
      toast.error(err.message);
    }
  };

  /**
   * @function handleVerifyForgotOtp
   * @description Verifies OTP for forgot password flow and moves to reset step
   */
  const handleVerifyForgotOtp = async () => {
    try {
      await verifyForgotOtp(forgotEmail, forgotOtp);
      toast.success("OTP verified");
      setForgotStep(3);
    } catch (err) {
      toast.error(err.message);
    }
  };

  /**
   * @function handleResetPassword
   * @description Validates new password and sends reset request to server
   */
  const handleResetPassword = async () => {
    setResetError("");

    if (!newPassword) {
      return setResetError("Password is required");
    }

    if (!/^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(newPassword)) {
      return setResetError(
        "Min 6 chars, 1 uppercase, 1 special character required",
      );
    }

    if (newPassword !== confirmNewPassword) {
      return setResetError("Passwords do not match");
    }

    try {
      await resetPassword(forgotEmail, newPassword);
      toast.success("Password updated");
      setShowForgotModal(false);
      setForgotStep(1);
      setConfirmNewPassword("");
      setNewPassword("");
      setFormData((prev) => ({ ...prev, email: forgotEmail }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-(--color-background) px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row bg-(--color-card)"
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
      </div>

      {/* RESTORE MODAL */}
      <AnimatePresence>
        {showRestoreModal && (
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div variants={modalAnim}>
              <Modal
                title="Restore Account"
                onClose={() => setShowRestoreModal(false)}
              >
                <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
                  Your account is deactivated. Enter OTP to restore it.
                </p>

                {step === 1 ? (
                  <>
                    <input
                      value={formData.email}
                      disabled
                      className="w-full p-3 rounded-xl 
                bg-[var(--color-card)] 
                border border-[var(--color-border)] 
                text-[var(--color-foreground)] 
                opacity-70"
                    />

                    <button
                      onClick={handleRequestOtp}
                      className="mt-3 w-full p-3 rounded-xl 
                bg-[var(--color-primary)] 
                text-[var(--color-primary-foreground)] 
                font-semibold"
                    >
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full p-3 rounded-xl 
                bg-[var(--color-card)] 
                border border-[var(--color-border)] 
                text-[var(--color-foreground)] 
                focus:ring-2 focus:ring-[var(--color-primary)]"
                    />

                    <button
                      onClick={handleVerifyOtp}
                      className="mt-3 w-full p-3 rounded-xl 
                bg-[var(--color-primary)] 
                text-[var(--color-primary-foreground)] 
                font-semibold"
                    >
                      Verify & Restore
                    </button>
                  </>
                )}
              </Modal>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div variants={modalAnim}>
              <Modal
                title="Reset Password"
                onClose={() => {
                  setShowForgotModal(false);
                  setForgotStep(1);
                }}
              >
                <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
                  Complete steps to reset your password
                </p>

                {forgotStep === 1 && (
                  <>
                    <input
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)]"
                    />

                    <button
                      onClick={handleForgotRequest}
                      className="mt-3 w-full p-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    >
                      Send OTP
                    </button>
                  </>
                )}

                {forgotStep === 2 && (
                  <>
                    <input
                      placeholder="Enter OTP"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)]"
                    />

                    <button
                      onClick={handleVerifyForgotOtp}
                      className="mt-3 w-full p-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    >
                      Verify OTP
                    </button>
                  </>
                )}

                {forgotStep === 3 && (
                  <>
                    <div className="relative">
                      <input
                        type={showResetPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 pr-10 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)]"
                      />

                      <span
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-muted-foreground)]"
                      >
                        {showResetPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>

                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full mt-3 p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)]"
                    />

                    {resetError && (
                      <p className="mt-2 text-sm text-[var(--color-destructive)]">
                        {resetError}
                      </p>
                    )}

                    <button
                      onClick={handleResetPassword}
                      className="mt-3 w-full p-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold"
                    >
                      Reset Password
                    </button>
                  </>
                )}
              </Modal>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Login;
