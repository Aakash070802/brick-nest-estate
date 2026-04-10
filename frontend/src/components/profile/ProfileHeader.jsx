import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";

const ProfileHeader = ({ user, fileRef, handleAvatar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4"
    >
      {/* AVATAR WRAPPER */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => fileRef.current.click()}
        className="relative cursor-pointer"
      >
        {/* OUTER RING */}
        <div
          className="p-[3px] rounded-full"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-chart-2))",
          }}
        >
          {/* INNER IMAGE */}
          <div className="bg-[var(--color-card)] rounded-full p-[3px]">
            <motion.img
              key={user?.avatar}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={user?.avatar || "/default-user.png"}
              className="w-28 h-28 rounded-full object-cover 
              border border-[var(--color-border)]"
            />
          </div>
        </div>

        {/* EDIT BUTTON */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-1 right-1 
          p-2 rounded-full shadow-md
          bg-[var(--color-primary)]
          text-[var(--color-primary-foreground)]
          border border-[var(--color-border)]"
        >
          <FaEdit size={12} />
        </motion.div>

        {/* HOVER OVERLAY */}
        <div
          className="absolute inset-0 rounded-full 
          bg-black/0 hover:bg-black/20 
          transition duration-300"
        />
      </motion.div>

      {/* USERNAME (OPTIONAL BUT IMPORTANT) */}
      {user?.username && (
        <p className="text-sm font-medium text-[var(--color-foreground)]">
          {user.username}
        </p>
      )}

      {/* Hidden File Input */}
      <input type="file" ref={fileRef} onChange={handleAvatar} hidden />
    </motion.div>
  );
};

export default ProfileHeader;
