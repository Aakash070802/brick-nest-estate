import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import darkLogo from "../assets/logo-dark.png";
import lightLogo from "../assets/logo-light.png";
import { useTheme } from "../hooks/useTheme";

const Header = () => {
  const location = useLocation();
  const isSignIn = location.pathname === "/sign-in";

  const { theme, toggleTheme } = useTheme();

  return (
    <header className="shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 py-6">
        {/* LEFT NAV */}
        <div className="flex gap-6">
          <Link
            to="/search?type=buy"
            className="font-medium text-sm sm:text-lg text-(--color-text)"
          >
            Buy
          </Link>
          <Link
            to="/search?type=rent"
            className="font-medium text-sm sm:text-lg text-(--color-text)"
          >
            Rent
          </Link>
          <Link
            to="/search?type=sell"
            className="font-medium text-sm sm:text-lg text-(--color-text)"
          >
            Sell
          </Link>
          <Link
            to="/about"
            className="font-medium text-sm sm:text-lg text-(--color-text)"
          >
            About
          </Link>
        </div>

        {/* CENTER (LOGO + THEME TOGGLE) */}
        <div className="flex items-center gap-4">
          <img
            src={theme === "light" ? darkLogo : lightLogo}
            alt="logo"
            className="h-20 object-contain"
          />

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-(--color-card) transition flex items-center justify-center"
          >
            {theme === "dark" ? (
              <FaSun size={16} className="text-yellow-400" />
            ) : (
              <FaMoon size={16} className="text-(--color-text)" />
            )}
          </button>
        </div>

        {/* AUTH BUTTONS */}
        <div className="relative flex items-center w-40">
          <div
            className={`absolute w-1/2 h-8 rounded-full transition-all duration-300 ${
              isSignIn ? "translate-x-full" : "translate-x-0"
            }`}
            style={{
              background: "var(--gradient-primary)",
            }}
          />
          <Link
            to="/sign-up"
            className={`w-1/2 text-center text-sm font-medium z-10 leading-8 ${
              !isSignIn ? "text-white" : "text-(--color-text-muted)"
            }`}
          >
            Sign up
          </Link>
          <Link
            to="/sign-in"
            className={`w-1/2 text-center text-sm font-medium z-10 leading-8 ${
              isSignIn ? "text-white" : "text-(--color-text-muted)"
            }`}
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
