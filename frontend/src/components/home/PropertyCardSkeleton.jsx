import { motion } from "framer-motion";

const shimmer = {
  animate: {
    background: [
      "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
      "linear-gradient(90deg, #ddd 25%, #eee 37%, #ddd 63%)",
    ],
    transition: {
      duration: 1.2,
      repeat: Infinity,
    },
  },
};

const PropertyCardSkeleton = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
      {/* IMAGE */}
      <motion.div
        variants={shimmer}
        animate="animate"
        className="w-full h-40"
      />

      <div className="p-3 space-y-2">
        <motion.div
          variants={shimmer}
          animate="animate"
          className="h-3 w-3/4 rounded"
        />
        <motion.div
          variants={shimmer}
          animate="animate"
          className="h-3 w-1/2 rounded"
        />
        <motion.div
          variants={shimmer}
          animate="animate"
          className="h-4 w-1/3 rounded"
        />
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
