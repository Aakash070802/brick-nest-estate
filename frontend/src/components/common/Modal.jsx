import { motion } from "framer-motion";

const Modal = ({ children, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-(--color-surface) p-6 rounded-xl w-[90%] max-w-sm"
      >
        {children}
      </motion.div>
    </>
  );
};

export default Modal;
