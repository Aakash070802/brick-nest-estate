import { FaMoon } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-primary text-text rounded-xl cursor-pointer"
    >
      {theme === "dark" ? (
        <IoMdSunny color="white" />
      ) : (
        <FaMoon color="black" />
      )}
    </button>
  );
};

export default ThemeToggle;
