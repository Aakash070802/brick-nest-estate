import { motion, AnimatePresence } from "framer-motion";
import CreateListingForm from "./CreateListingForm";

const CreateListingModal = ({ open, onClose, onSuccess }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed z-50 top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2 
            w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto 
            bg-(--color-surface) rounded-xl p-4 sm:p-6"
          >
            <CreateListingForm onClose={onClose} onSuccess={onSuccess} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateListingModal;
