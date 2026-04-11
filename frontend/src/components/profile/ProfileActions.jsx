import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
};

const ProfileActions = ({ onPassword, onDelete, onCreateListing }) => {
  return (
    <motion.div
      className="mt-6 flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* CHANGE PASSWORD (SECONDARY) */}
      <motion.button
        variants={buttonVariants}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onPassword}
        className="p-3 rounded-xl font-medium 
        text-[var(--color-secondary-foreground)] 
        bg-[var(--color-chart-2)] 
        hover:opacity-90 transition"
      >
        Change Password
      </motion.button>

      {/* DELETE ACCOUNT (DESTRUCTIVE) */}
      <motion.button
        variants={buttonVariants}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onDelete}
        className="p-3 rounded-xl font-medium 
        text-[var(--color-destructive-foreground)] 
        bg-[var(--color-destructive)] 
        hover:opacity-90 transition"
      >
        Delete Account
      </motion.button>
    </motion.div>
  );
};

export default ProfileActions;
