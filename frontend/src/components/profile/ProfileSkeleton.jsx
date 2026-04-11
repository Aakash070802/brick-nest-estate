import { motion } from "framer-motion";

const shimmer =
  "bg-gradient-to-r from-[var(--color-muted)] via-[var(--color-border)] to-[var(--color-muted)] animate-pulse";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen px-4 py-10 bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className={`h-6 w-32 rounded ${shimmer}`} />
          <div className={`h-8 w-40 rounded ${shimmer}`} />
        </div>

        {/* CARD */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3">
            <div className={`w-28 h-28 rounded-full ${shimmer}`} />
            <div className={`h-4 w-24 rounded ${shimmer}`} />
          </div>

          {/* FORM */}
          <div className="space-y-3">
            <div className={`h-10 w-full rounded ${shimmer}`} />
            <div className={`h-10 w-full rounded ${shimmer}`} />
            <div className={`h-10 w-32 rounded ${shimmer}`} />
          </div>

          {/* ACTIONS */}
          <div className="space-y-2">
            <div className={`h-10 w-full rounded ${shimmer}`} />
            <div className={`h-10 w-full rounded ${shimmer}`} />
            <div className={`h-10 w-full rounded ${shimmer}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
