import { useState } from "react";
import { Check, Minus } from "lucide-react";

const Checkbox = ({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  size = "md",
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onChange && onChange(!checked);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`
        ${sizes[size]}
        flex items-center justify-center
        rounded-md border
        transition-all duration-200 cursor-pointer

        ${
          checked || indeterminate
            ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-primary-foreground)]"
            : "bg-[var(--color-card)] border-[var(--color-border)]"
        }

        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:ring-2 hover:ring-[var(--color-ring)]"
        }

        ${isPressed ? "scale-90" : "scale-100"}
      `}
    >
      {/* ICON */}
      {indeterminate ? (
        <Minus className="w-3.5 h-3.5" />
      ) : checked ? (
        <Check className="w-3.5 h-3.5" />
      ) : null}
    </button>
  );
};

export default Checkbox;
