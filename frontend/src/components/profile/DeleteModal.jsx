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

const DeleteModal = ({ open, onClose, onConfirm }) => {
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
              <h3 className="text-red-500 font-semibold mb-3">
                Delete Account?
              </h3>

              <p className="text-sm mb-4">This action cannot be undone.</p>

              <div className="flex gap-2">
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>

                <button onClick={onClose} className="flex-1 border p-2 rounded">
                  Cancel
                </button>
              </div>
            </Modal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
