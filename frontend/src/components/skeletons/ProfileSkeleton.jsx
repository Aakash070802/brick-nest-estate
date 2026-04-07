import { motion } from "framer-motion";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10 bg-(--color-bg)">
      <div className="w-full max-w-md bg-(--color-surface) p-6 rounded-2xl shadow-lg animate-pulse">
        {/* AVATAR */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-(--color-border)" />
        </div>

        {/* INPUTS */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="h-12 rounded-xl bg-(--color-border)" />
          <div className="h-12 rounded-xl bg-(--color-border)" />

          <div className="h-12 rounded-xl bg-(--color-border)" />
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="h-12 rounded-xl bg-(--color-border)" />
          <div className="h-12 rounded-xl bg-(--color-border)" />
          <div className="h-12 rounded-xl bg-(--color-border)" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
