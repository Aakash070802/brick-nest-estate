import { motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ children, onClose, title }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2 
        w-[92%] sm:w-[85%] md:w-[420px] 
        max-h-[90vh] overflow-y-auto
        bg-[var(--color-card)] 
        text-[var(--color-foreground)] 
        rounded-2xl shadow-xl p-5 sm:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-muted)] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">{children}</div>
      </motion.div>
    </>
  );
};

export default Modal;
