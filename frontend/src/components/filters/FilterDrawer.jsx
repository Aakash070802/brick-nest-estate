import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const drawerVariants = {
  hidden: { x: -320 },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 25 },
  },
  exit: { x: -320 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.4 },
  exit: { opacity: 0 },
};

const FilterDrawer = ({ onApply }) => {
  const [open, setOpen] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    type: "all",
    offer: false,
    furnished: false,
    parking: false,
  });

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl border border-[var(--color-border)] 
        bg-[var(--color-card)] text-[var(--color-foreground)] 
        hover:shadow-md transition"
      >
        Filters
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 h-full w-80 z-50 p-5
              bg-[var(--color-card)] text-[var(--color-foreground)]
              border-r border-[var(--color-border)]
              shadow-xl flex flex-col"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-[var(--color-muted-foreground)] hover:opacity-70"
                >
                  Close
                </button>
              </div>

              {/* TYPE */}
              <div className="mb-5">
                <label className="block text-sm mb-1 text-[var(--color-muted-foreground)]">
                  Property Type
                </label>

                <select
                  value={localFilters.type}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border
                  bg-[var(--color-background)]
                  border-[var(--color-border)]
                  text-[var(--color-foreground)] outline-none"
                >
                  <option value="all">All</option>
                  <option value="rent">Rent</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              {/* CHECKBOXES */}
              <div className="space-y-3 mb-6">
                {[
                  { key: "offer", label: "Offers Only" },
                  { key: "furnished", label: "Furnished" },
                  { key: "parking", label: "Parking Available" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters[key]}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-[var(--color-primary)]"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => {
                    setLocalFilters({
                      type: "all",
                      offer: false,
                      furnished: false,
                      parking: false,
                    });
                  }}
                  className="w-full py-2 rounded-lg border 
                  border-[var(--color-border)] text-sm 
                  hover:bg-[var(--color-muted)] transition"
                >
                  Reset
                </button>

                <button
                  onClick={handleApply}
                  className="w-full py-2 rounded-lg 
                  bg-[var(--color-primary)] 
                  text-[var(--color-primary-foreground)]
                  hover:opacity-90 transition font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterDrawer;
