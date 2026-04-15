import { motion } from "framer-motion";

const shimmer = {
  animate: {
    backgroundPosition: ["-200% 0", "200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const baseStyle =
  "bg-[linear-gradient(90deg,var(--color-muted)_25%,var(--color-border)_37%,var(--color-muted)_63%)] bg-[length:200%_100%]";

const PropertyCardSkeleton = () => {
  return (
    <motion.div
      variants={shimmer}
      animate="animate"
      className="rounded-2xl overflow-hidden 
      border border-[var(--color-border)] 
      bg-[var(--color-card)]"
    >
      {/* IMAGE */}
      <div className={`w-full h-48 ${baseStyle}`} />

      <div className="p-4 flex flex-col gap-3">
        {/* USER ROW */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${baseStyle}`} />
            <div className={`h-3 w-16 rounded ${baseStyle}`} />
          </div>
          <div className={`h-2 w-10 rounded ${baseStyle}`} />
        </div>

        {/* TITLE */}
        <div className={`h-4 w-3/4 rounded ${baseStyle}`} />

        {/* ADDRESS */}
        <div className={`h-3 w-2/3 rounded ${baseStyle}`} />

        {/* FEATURES */}
        <div className="flex gap-4">
          <div className={`h-3 w-10 rounded ${baseStyle}`} />
          <div className={`h-3 w-10 rounded ${baseStyle}`} />
        </div>

        {/* PRICE */}
        <div className="flex justify-between items-center mt-2">
          <div className={`h-5 w-20 rounded ${baseStyle}`} />
          <div className={`h-3 w-12 rounded ${baseStyle}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCardSkeleton;
