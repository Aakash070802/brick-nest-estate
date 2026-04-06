import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import darkLogo from "../../assets/logo-dark.png";
import lightLogo from "../../assets/logo-light.png";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { GoAlertFill } from "react-icons/go";
import { useTheme } from "../../hooks/useTheme";
import { useSelector } from "react-redux";
// LOGOUT STATES
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logoutCurrentDevice,
  logoutAllDevices,
} from "../../services/authService";
import { loginFailure } from "../../redux/features/userSlice";
import { toast } from "react-toastify";

const Header = () => {
  const location = useLocation();
  const isSignIn = location.pathname === "/login";
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = ["buy", "rent", "sell"];
  const { currentUser } = useSelector((state) => state.user);

  // LOGOUT HANDLERS
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutCurrentDevice();
      dispatch(loginFailure(null));
      toast.success("Logged out");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllDevices();
      dispatch(loginFailure(null));
      toast.success("Logged out from all devices");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

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
          {!currentUser ? (
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
          ) : (
            <div className="hidden md:block relative">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <div className="p-0.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-500">
                  <img
                    src={currentUser.avatar || "/default-user.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full" />
              </motion.div>
              <AnimatePresence>
                {showDropdown && (
                  <>
                    {/* CLICK OUTSIDE */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />

                    {/* DROPDOWN */}
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-56 bg-(--color-card) border border-(--color-border) rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      {/* PROFILE */}
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-(--color-text) hover:bg-(--color-surface) hover:text-green-500 cursor-pointer transition"
                      >
                        <CgProfile /> View Profile
                      </button>

                      {/* LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-(--color-text) hover:bg-(--color-surface) hover:text-red-500 cursor-pointer transition"
                      >
                        <IoMdLogOut /> Logout
                      </button>

                      {/* LOGOUT ALL */}
                      <button
                        onClick={handleLogoutAll}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 cursor-pointer transition"
                      >
                        <GoAlertFill /> Logout All Devices
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

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

              {/* AUTH SECTION (MOBILE) */}
              <div className="mt-auto pt-8 flex flex-col gap-4">
                {!currentUser ? (
                  <>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-center py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white font-medium"
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
                  </>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center py-2 rounded-lg bg-(--color-primary) text-white font-medium"
                  >
                    Profile
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
