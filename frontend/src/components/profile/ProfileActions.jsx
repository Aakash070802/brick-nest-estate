import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
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
      <motion.button
        variants={buttonVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPassword}
        className="p-3 rounded-xl bg-slate-800 cursor-pointer text-white"
      >
        Change Password
      </motion.button>

      <motion.button
        variants={buttonVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateListing}
        className="p-3 bg-green-500 cursor-pointer text-white rounded-xl hover:bg-green-700 transition-colors"
      >
        Create Listing
      </motion.button>

      <motion.button
        variants={buttonVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDelete}
        className="p-3 cursor-pointer bg-red-500 text-white rounded-xl hover:bg-red-700 transition-colors"
      >
        Delete Account
      </motion.button>
    </motion.div>
  );
};

export default ProfileActions;
