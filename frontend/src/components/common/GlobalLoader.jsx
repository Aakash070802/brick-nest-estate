import { motion } from "framer-motion";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 bg-(--color-bg) flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Skeleton Bar */}
        <motion.div className="w-40 h-3 rounded-full bg-(--color-card) overflow-hidden">
          <motion.div
            className="h-full bg-(--color-primary)"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            }}
          />
        </motion.div>

        <p className="text-sm text-(--color-text-muted)">Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
