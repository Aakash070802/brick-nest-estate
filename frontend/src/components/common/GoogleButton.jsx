import { motion } from "framer-motion";

const GoogleButton = ({ onClick, loading }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-center gap-3 w-full px-6 py-3 
      rounded-xl border border-gray-300 bg-white 
      shadow-sm hover:shadow-md hover:bg-gray-50 
      transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {/* Google Logo */}
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />

      {/* Text */}
      <span className="text-sm font-medium text-gray-700">
        {loading ? "Loading..." : "Continue with Google"}
      </span>
    </motion.button>
  );
};

export default GoogleButton;
