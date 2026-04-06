import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import darkLogo from "../../assets/logo-dark.png";
import lightLogo from "../../assets/logo-light.png";
import { useTheme } from "../../hooks/useTheme";

const Header = () => {
  const location = useLocation();
  const isSignIn = location.pathname === "/login";
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["buy", "rent", "sell"];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-transparent z-50 w-full"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* LEFT NAV (DESKTOP) */}
        <div className="hidden md:flex gap-6 lg:gap-8">
          {navItems.map((type) => (
            <motion.div
              key={type}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                to={`/search?type=${type}`}
                className="font-medium text-sm lg:text-base text-(--color-text) hover:opacity-80 transition"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Link>
            </motion.div>
          ))}

          <Link
            to="/about"
            className="font-medium text-sm lg:text-base text-(--color-text) hover:opacity-80 transition"
          >
            About
          </Link>
        </div>

        {/* CENTER */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/">
            <motion.img
              src={theme === "light" ? darkLogo : lightLogo}
              alt="logo"
              className="h-10 sm:h-12 md:h-14 lg:h-16 object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
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

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* AUTH (DESKTOP) */}
          <div className="hidden md:flex relative items-center w-44 lg:w-48">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute w-1/2 h-9 rounded-full"
              animate={{
                x: isSignIn ? "100%" : "0%",
              }}
              style={{
                background: "var(--gradient-primary)",
              }}
            />

            <Link
              to="/register"
              className={`w-1/2 text-center text-sm font-medium z-10 leading-9 ${
                !isSignIn ? "text-white" : "text-(--color-text-muted)"
              }`}
            >
              Sign up
            </Link>

            <Link
              to="/login"
              className={`w-1/2 text-center text-sm font-medium z-10 leading-9 ${
                isSignIn ? "text-white" : "text-(--color-text-muted)"
              }`}
            >
              Sign in
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-(--color-text)"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* SIDE DRAWER */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 right-0 h-full w-72 bg-(--color-card) z-50 md:hidden shadow-xl p-6 flex flex-col"
            >
              {/* CLOSE BUTTON */}
              <div className="flex justify-end mb-6">
                <button onClick={() => setMenuOpen(false)}>
                  <FaTimes size={22} className="text-(--color-text)" />
                </button>
              </div>

              {/* NAV LINKS */}
              <div className="flex flex-col gap-6 text-lg">
                {navItems.map((type) => (
                  <Link
                    key={type}
                    to={`/search?type=${type}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-(--color-text) font-medium hover:opacity-80 transition"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Link>
                ))}

                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="text-(--color-text) font-medium hover:opacity-80 transition"
                >
                  About
                </Link>
              </div>

              {/* AUTH SECTION */}
              <div className="mt-auto pt-8 flex flex-col gap-4">
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium"
                >
                  Sign up
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg border border-(--color-text-muted) font-medium text-(--color-text)"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
