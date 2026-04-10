import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../common/Modal";
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
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 40,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const PasswordModal = ({
  open,
  onClose,
  passwords,
  setPasswords,
  onSubmit,
}) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const isMatch =
    passwords.newPassword &&
    confirmPassword &&
    passwords.newPassword === confirmPassword;

  const handleSubmit = () => {
    if (!isMatch) return;
    onSubmit();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div variants={modalAnim}>
            <Modal onClose={onClose}>
              <h3 className="mb-4 font-semibold text-[var(--color-foreground)]">
                Change Password
              </h3>

              {/* CURRENT PASSWORD */}
              <div className="relative mb-3">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
                >
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* NEW PASSWORD */}
              <div className="relative mb-3">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value,
                    })
                  }
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative mb-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* VALIDATION MESSAGE */}
              {confirmPassword && !isMatch && (
                <p className="text-sm text-[var(--color-destructive)] mb-3">
                  Passwords do not match
                </p>
              )}

              {isMatch && (
                <p className="text-sm text-[var(--color-chart-5)] mb-3">
                  Passwords match
                </p>
              )}

              {/* BUTTON */}
              <button
                onClick={handleSubmit}
                disabled={!isMatch}
                className="w-full p-2 rounded-lg font-medium
                text-[var(--color-secondary-foreground)]
                bg-[var(--color-chart-2)]
                hover:opacity-90 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Password
              </button>
            </Modal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordModal;
