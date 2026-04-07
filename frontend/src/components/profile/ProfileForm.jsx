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
        className="p-3 rounded-xl border outline-none"
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
        className="p-3 rounded-xl border outline-none"
        placeholder="Email"
      />

      {/* Button */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpdate}
        className="p-3 rounded-xl text-white cursor-pointer"
        style={{ background: "var(--gradient-primary)" }}
      >
        {loading ? "Updating..." : "Save Changes"}
      </motion.button>
    </motion.div>
  );
};

export default ProfileForm;
