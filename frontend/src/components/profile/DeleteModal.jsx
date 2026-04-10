import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

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

const DeleteModal = ({ open, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            variants={modalAnim}
            className="w-[92%] sm:w-[420px] max-h-[90vh] overflow-y-auto
            bg-[var(--color-card)]
            text-[var(--color-foreground)]
            rounded-2xl shadow-xl p-6"
          >
            {/* ICON */}
            <div className="flex justify-center mb-4">
              <div
                className="p-3 rounded-full"
                style={{ background: "var(--color-destructive)/15" }}
              >
                <AlertTriangle
                  size={28}
                  className="text-[var(--color-destructive)]"
                />
              </div>
            </div>

            {/* TITLE */}
            <h3 className="text-center text-lg font-semibold mb-2">
              Delete Account
            </h3>

            {/* MESSAGE */}
            <p className="text-center text-sm text-[var(--color-muted-foreground)] mb-5">
              This action is permanent. All your data will be removed and cannot
              be recovered.
            </p>

            {/* ACTIONS */}
            <div className="flex gap-3">
              {/* DELETE */}
              <button
                onClick={onConfirm}
                className="flex-1 p-2.5 rounded-lg font-medium
                text-[var(--color-destructive-foreground)]
                bg-[var(--color-destructive)]
                hover:opacity-90 transition"
              >
                Delete
              </button>

              {/* CANCEL */}
              <button
                onClick={onClose}
                className="flex-1 p-2.5 rounded-lg font-medium
                border border-[var(--color-border)]
                text-[var(--color-foreground)]
                bg-[var(--color-card)]
                hover:bg-[var(--color-muted)] transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
