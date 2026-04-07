import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";

const ProfileHeader = ({ user, fileRef, handleAvatar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-3"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer p-0.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
        onClick={() => fileRef.current.click()}
      >
        {/* Avatar */}
        <motion.img
          key={user?.avatar} // triggers animation when avatar changes
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          src={user?.avatar || "/default-user.png"}
          className="w-24 h-24 rounded-full object-cover border border-white"
        />

        {/* Edit Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute bottom-0 right-0 bg-black/70 p-2 rounded-full"
        >
          <FaEdit className="text-white text-xs" />
        </motion.div>
      </motion.div>

      {/* Hidden File Input */}
      <input type="file" ref={fileRef} onChange={handleAvatar} hidden />
    </motion.div>
  );
};

export default ProfileHeader;
