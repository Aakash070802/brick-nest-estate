import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const ProfileForm = ({ form, setForm, handleUpdate, loading }) => {
  return (
    <motion.div
      className="mt-6 flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Username */}
      <motion.input
        variants={itemVariants}
        whileFocus={{ scale: 1.02 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="input"
        placeholder="Username"
      />

      {/* Email */}
      <motion.input
        variants={itemVariants}
        whileFocus={{ scale: 1.02 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="input"
        placeholder="Email"
      />

      {/* PRIMARY ACTION */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleUpdate}
        disabled={loading}
        className="p-3 rounded-xl font-medium 
        text-[var(--color-primary-foreground)] 
        bg-[var(--color-primary)] 
        hover:opacity-90 transition
        disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Save Changes"}
      </motion.button>
    </motion.div>
  );
};

export default ProfileForm;
