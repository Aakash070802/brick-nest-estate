import { Link, useLocation } from "react-router-dom";
import darkLogo from "../assets/logo-dark.png";
import lightLogo from "../assets/logo-light.png";
import { IoMdSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";

const Header = () => {
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="w-full bg-bg text-text border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT NAV */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/search?type=buy" className="hover:text-primary">
            Buy
          </Link>
          <Link to="/search?type=rent" className="hover:text-primary">
            Rent
          </Link>
          <Link to="/search?type=sell" className="hover:text-primary">
            Sell
          </Link>
          <Link to="/about" className="hover:text-primary">
            About Us
          </Link>
        </div>

        {/* CENTER LOGO + THEME */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={darkMode ? darkLogo : lightLogo}
              alt="logo"
              className="w-24 h-24"
            />
          </Link>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-primary/10 transition"
          >
            {darkMode ? <IoMdSunny /> : <FaMoon />}
          </button>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 text-sm font-medium">
          {/* SIGN UP */}
          <Link
            to="/register"
            className={`px-4 py-2 rounded-xl transition ${
              location.pathname === "/register"
                ? "bg-primary text-btnText"
                : "hover:text-primary"
            }`}
          >
            Sign Up
          </Link>

          {/* SIGN IN */}
          <Link
            to="/login"
            className={`px-4 py-2 rounded-xl transition ${
              location.pathname === "/login"
                ? "bg-primary text-btnText"
                : "hover:text-primary"
            }`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
