import { motion } from "framer-motion";

const GoogleButton = ({ onClick, loading }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.97 }}
      className="flex items-center justify-center gap-3 w-full px-6 py-3 
      rounded-xl 
      border border-[var(--color-border)] 
      bg-[var(--color-card)] 
      text-[var(--color-foreground)] 
      shadow-sm 
      hover:bg-[var(--color-muted)] 
      hover:shadow-md
      transition-all duration-200 
      disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {/* Logo OR Loader */}
      {loading ? (
        <div className="w-5 h-5 border-2 border-[var(--color-muted-foreground)] border-t-transparent rounded-full animate-spin" />
      ) : (
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
      )}

      {/* Text */}
      <span className="text-sm font-medium">
        {loading ? "Signing in..." : "Continue with Google"}
      </span>
    </motion.button>
  );
};

export default GoogleButton;
