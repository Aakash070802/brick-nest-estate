import { motion } from "framer-motion";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--color-background)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Skeleton Bar */}
        <div className="w-40 h-3 rounded-full bg-[var(--color-card)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-primary)]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            }}
          />
        </div>

        <p className="text-sm text-[var(--color-muted-foreground)]">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
