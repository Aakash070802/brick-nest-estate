import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";
import { useId } from "react";

export const ThemeToggleButton = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // ✅ unique ID for SVG clipPath
  const clipId = useId();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center",
        isDark ? "bg-white text-black" : "bg-black text-white",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 32 32"
        className="w-6 h-6"
      >
        <clipPath id={clipId}>
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>

        <g clipPath={`url(#${clipId})`}>
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            initial={false}
            transition={{ duration: 0.35 }}
            cx="16"
            cy="16"
          />

          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
};
