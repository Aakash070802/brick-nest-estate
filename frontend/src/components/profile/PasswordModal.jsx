import { AnimatePresence, motion } from "framer-motion";
import Modal from "../common/Modal";

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
              <h3 className="mb-3 font-semibold">Change Password</h3>

              <input
                type="password"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="p-2 border rounded-lg w-full mb-2"
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
                className="p-2 border rounded-lg w-full mb-3"
              />

              <button
                onClick={onSubmit}
                className="w-full p-2 bg-blue-500 text-white rounded-lg"
              >
                Update
              </button>
            </Modal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordModal;
