import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";
import darkLogo from "../../assets/logo-dark.png";
import lightLogo from "../../assets/logo-light.png";

const Header = ({ theme, toggleTheme, isSignIn }) => {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-transparent z-50"
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 py-4">
        {/* LEFT NAV */}
        <motion.div
          className="flex gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {["buy", "rent", "sell"].map((type) => (
            <motion.div
              key={type}
              variants={{
                hidden: { y: 10, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <Link
                to={`/search?type=${type}`}
                className="font-medium text-sm sm:text-lg text-(--color-text)"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Link>
            </motion.div>
          ))}

          <motion.div
            variants={{
              hidden: { y: 10, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <Link
              to="/about"
              className="font-medium text-sm sm:text-lg text-(--color-text)"
            >
              About
            </Link>
          </motion.div>
        </motion.div>

        {/* CENTER */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <motion.img
              src={theme === "light" ? darkLogo : lightLogo}
              alt="logo"
              className="h-16 object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          </Link>

          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full bg-(--color-card)"
          >
            {theme === "dark" ? (
              <FaSun size={16} className="text-yellow-400" />
            ) : (
              <FaMoon size={16} className="text-(--color-text)" />
            )}
          </motion.button>
        </div>

        {/* AUTH */}
        <div className="relative flex items-center w-40">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute w-1/2 h-8 rounded-full"
            animate={{
              x: isSignIn ? "100%" : "0%",
            }}
            style={{
              background: "var(--gradient-primary)",
            }}
          />

          <Link
            to="/register"
            className={`w-1/2 text-center text-sm font-medium z-10 leading-8 ${
              !isSignIn ? "text-white" : "text-(--color-text-muted)"
            }`}
          >
            Sign up
          </Link>

          <Link
            to="/login"
            className={`w-1/2 text-center text-sm font-medium z-10 leading-8 ${
              isSignIn ? "text-white" : "text-(--color-text-muted)"
            }`}
          >
            Sign in
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
