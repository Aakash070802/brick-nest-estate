import { useEffect, useState } from "react";
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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState(["", "", "", "", "", ""]);

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authLoading, error } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
      dispatch(loginFailure(err.message));
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

  // TIMER
  useEffect(() => {
    if (!showRestoreModal && !showForgotModal) return;

    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showRestoreModal, showForgotModal]);

  const handleRequestOtp = async () => {
    try {
      await requestRestore(formData.email);
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      setCanResend(false);
      setStep(2);
      toast.success("OTP sent");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const finalOtp = otp.join("");
      const data = await verifyRestore(formData.email, finalOtp);
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
      setForgotOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      setCanResend(false);
      setForgotStep(2);
      toast.success("OTP sent");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleOtpChange = (value, index, setter, state) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...state];
    updated[index] = value;
    setter(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyForgotOtp = async () => {
    try {
      const finalOtp = forgotOtp.join("");
      await verifyForgotOtp(forgotEmail, finalOtp);
      toast.success("OTP verified");
      setForgotStep(3);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!canResend) return;

      if (showRestoreModal) {
        await requestRestore(formData.email);
        setOtp(["", "", "", "", "", ""]);
      } else {
        await forgotPasswordRequest(forgotEmail);
        setForgotOtp(["", "", "", "", "", ""]);
      }

      setTimeLeft(60);
      setCanResend(false);

      toast.success("OTP resent");
    } catch (err) {
      toast.error(err.message);
    }
  };

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

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
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
            loading={authLoading}
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
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4 text-center">
                  Enter the 6-digit code sent to your email
                </p>

                {step === 1 ? (
                  <>
                    <input
                      value={formData.email}
                      disabled
                      className="w-full p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] opacity-70"
                    />

                    <button
                      onClick={handleRequestOtp}
                      className="mt-3 w-full p-3 rounded-xl bg-[var(--color-chart-5)] text-[var(--color-secondary-foreground)] font-medium"
                    >
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    {/* OTP BOXES */}
                    <div className="flex justify-center gap-3 mb-4">
                      {otp.map((digit, i) => (
                        <motion.input
                          key={i}
                          id={`otp-${i}`}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(e.target.value, i, setOtp, otp)
                          }
                          onPaste={(e) => {
                            const paste = e.clipboardData
                              .getData("text")
                              .slice(0, 6)
                              .split("");
                            if (paste.length === 6) {
                              setOtp(paste);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !otp[i] && i > 0) {
                              document.getElementById(`otp-${i - 1}`)?.focus();
                            }
                          }}
                          whileFocus={{ scale: 1.1 }}
                          className="w-12 h-12 text-center text-lg rounded-xl 
                          border border-[var(--color-border)] 
                          bg-[var(--color-card)] 
                          text-[var(--color-foreground)] 
                          focus:ring-2 focus:ring-[var(--color-ring)]"
                          maxLength={1}
                        />
                      ))}
                    </div>

                    {/* TIMER */}
                    <p className="text-center text-sm text-[var(--color-muted-foreground)] mb-2">
                      {canResend
                        ? "You can resend OTP now"
                        : `Resend in ${formatTime(timeLeft)}`}
                    </p>

                    {/* VERIFY */}
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otp.includes("")}
                      className="w-full p-3 rounded-xl 
                      bg-[var(--color-primary)] 
                      text-[var(--color-primary-foreground)] 
                      disabled:opacity-50"
                    >
                      Verify & Restore
                    </button>

                    {/* RESEND */}
                    <button
                      onClick={handleResendOtp}
                      disabled={!canResend}
                      className="mt-2 w-full p-2 rounded-xl 
                      bg-[var(--color-chart-2)] 
                      text-[var(--color-secondary-foreground)] 
                      disabled:opacity-50"
                    >
                      Resend OTP
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
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4 text-center">
                  Follow steps to reset your password
                </p>

                {/* STEP 1 */}
                {forgotStep === 1 && (
                  <>
                    <input
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)]"
                    />

                    <button
                      onClick={handleForgotRequest}
                      className="mt-3 w-full p-3 rounded-xl bg-[var(--color-chart-5)] text-[var(--color-secondary-foreground)]"
                    >
                      Send OTP
                    </button>
                  </>
                )}

                {/* STEP 2 */}
                {forgotStep === 2 && (
                  <>
                    <div className="flex justify-center gap-3 mb-4">
                      {forgotOtp.map((digit, i) => (
                        <motion.input
                          key={i}
                          id={`otp-${i}`}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              e.target.value,
                              i,
                              setForgotOtp,
                              forgotOtp,
                            )
                          }
                          onPaste={(e) => {
                            const paste = e.clipboardData
                              .getData("text")
                              .slice(0, 6)
                              .split("");
                            if (paste.length === 6) {
                              setForgotOtp(paste);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !forgotOtp[i] &&
                              i > 0
                            ) {
                              document.getElementById(`otp-${i - 1}`)?.focus();
                            }
                          }}
                          whileFocus={{ scale: 1.1 }}
                          className="w-12 h-12 text-center text-lg rounded-xl 
                          border border-[var(--color-border)] 
                          bg-[var(--color-card)] 
                          text-[var(--color-foreground)] 
                          focus:ring-2 focus:ring-[var(--color-ring)]"
                          maxLength={1}
                        />
                      ))}
                    </div>

                    <p className="text-center text-sm text-[var(--color-muted-foreground)] mb-2">
                      {canResend
                        ? "You can resend OTP now"
                        : `Resend in ${formatTime(timeLeft)}`}
                    </p>

                    <button
                      onClick={handleVerifyForgotOtp}
                      disabled={forgotOtp.includes("")}
                      className="w-full p-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] disabled:opacity-50"
                    >
                      Verify OTP
                    </button>

                    <button
                      onClick={handleResendOtp}
                      disabled={!canResend}
                      className="mt-2 w-full p-2 rounded-xl 
                      bg-[var(--color-chart-2)] 
                      text-[var(--color-secondary-foreground)] 
                      disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </>
                )}

                {/* STEP 3 */}
                {forgotStep === 3 && (
                  <>
                    <div className="relative">
                      <input
                        type={showResetPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 pr-10 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)]"
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
                      className="w-full mt-3 p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)]"
                    />

                    {resetError && (
                      <p className="mt-2 text-sm text-[var(--color-destructive)]">
                        {resetError}
                      </p>
                    )}

                    <button
                      onClick={handleResetPassword}
                      className="mt-3 w-full p-3 rounded-xl bg-[var(--color-chart-5)] text-[var(--color-secondary-foreground)] font-semibold"
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
