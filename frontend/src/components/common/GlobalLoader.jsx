import { motion } from "framer-motion";

const GlobalLoader = () => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] 
      bg-[var(--color-background)]/80 backdrop-blur-md 
      flex flex-col items-center justify-center 
      pointer-events-auto"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
        className="w-12 h-12 rounded-full 
        border-4 border-[var(--color-muted)] 
        border-t-[var(--color-primary)]"
      />

      <p className="text-xs text-[var(--color-muted-foreground)] mt-3">
        Processing...
      </p>
    </motion.div>
  );
};

export default GlobalLoader;
