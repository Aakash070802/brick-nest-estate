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
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logoutCurrentDevice,
  logoutAllDevices,
} from "../../services/authService";
import { loginFailure } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import { ThemeToggleButton } from "../ui/theme-toggle-button";

const Header = () => {
  const location = useLocation();
  const isSignIn = location.pathname === "/login";

  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = ["rent", "sell", "contact", "about"];

  const { currentUser } = useSelector((state) => state.user);

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
    <header className="w-full sticky top-0 z-50 bg-background">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* LEFT NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item}
              to={
                item === "contact"
                  ? "/contact"
                  : item === "about"
                    ? "/about"
                    : `/search?type=${item}`
              }
              className="text-sm tracking-widest md:text-base font-medium text-foreground hover:opacity-70 transition"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>

        {/* CENTER */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={theme === "dark" ? lightLogo : darkLogo}
              className="h-10"
              alt="logo"
            />
          </Link>

          <ThemeToggleButton className="h-10 w-10 cursor-pointer" />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {!currentUser ? (
            <div className="hidden md:flex relative items-center w-52 h-10 bg-muted rounded-full overflow-hidden shadow-inner">
              {/* SLIDER */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute w-1/2 h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500 shadow-md"
                animate={{
                  x: isSignIn ? "100%" : "0%",
                }}
              />

              <Link
                to="/register"
                className={`w-1/2 text-center z-10 text-sm font-medium leading-10 tracking-wider ${
                  !isSignIn ? "text-white" : "text-foreground"
                }`}
              >
                Sign up
              </Link>

              <Link
                to="/login"
                className={`w-1/2 text-center z-10 text-sm font-medium leading-10 tracking-wider ${
                  isSignIn ? "text-white" : "text-foreground"
                }`}
              >
                Sign in
              </Link>
            </div>
          ) : (
            <div className="relative">
              <div
                className="relative w-12 h-12 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {/* GRADIENT BORDER WRAPPER */}
                <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                  {/* IMAGE */}
                  <div className="w-full h-full rounded-full overflow-hidden bg-[var(--color-card)]">
                    <img
                      src={currentUser?.avatar || "/default-user.png"}
                      alt="user"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-user.png";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* ONLINE BADGE */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--color-background)] rounded-full"></span>
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-lg"
                  >
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex gap-2"
                    >
                      <CgProfile /> Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex gap-2"
                    >
                      <IoMdLogOut /> Logout
                    </button>

                    <button
                      onClick={handleLogoutAll}
                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex gap-2"
                    >
                      <GoAlertFill /> Logout All
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-foreground"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-72 h-full bg-card p-6 z-50"
          >
            {/* CLOSE */}
            <div className="flex justify-end mb-6">
              <button onClick={() => setMenuOpen(false)}>
                <FaTimes size={22} className="text-foreground" />
              </button>
            </div>

            {/* NAV */}
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={
                    item === "contact"
                      ? "/contact"
                      : item === "about"
                        ? "/about"
                        : `/search?type=${item}`
                  }
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-foreground tracking-widest"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </div>

            {/* AUTH */}
            {!currentUser && (
              <div className="flex flex-col gap-4 mt-10">
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white tracking-widest"
                >
                  Sign up
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg border border-border text-foreground tracking-widest"
                >
                  Sign in
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
