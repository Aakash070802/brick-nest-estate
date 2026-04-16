import { motion } from "framer-motion";
import {
  Shield,
  Database,
  Zap,
  Brain,
  Users,
  Layers,
  ArrowRight,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
      {title}
    </h2>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* HERO */}
      <div className="relative pt-24 pb-20 border-b border-[var(--color-border)] overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-muted)] text-xs tracking-widest mb-6">
              FULL-STACK • PRODUCTION-GRADE • ENGINEERED
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-none">
              BrickNest
            </h1>

            <p className="text-2xl text-[var(--color-muted-foreground)] max-w-2xl">
              A production-grade full-stack real estate platform engineered for
              complex authentication, high-performance data flows, and
              intelligent search at scale.
            </p>

            <div className="mt-8 flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                React + Redux + Tailwind
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Node.js • Express • MongoDB
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          {/* PRODUCT OVERVIEW */}
          <motion.div variants={fadeUp}>
            <SectionHeader icon={Layers} title="Product Overview" />
            <div className="max-w-3xl">
              <p className="text-lg leading-relaxed text-[var(--color-muted-foreground)]">
                BrickNest is a full-featured real estate platform that handles
                the complete lifecycle of property listings — from creation with
                multi-image Cloudinary uploads to advanced discovery through
                natural language AI search.
              </p>
              <p className="mt-4 text-[var(--color-muted-foreground)]">
                The system solves real production challenges: secure
                multi-device session management, efficient image handling with
                public ID tracking, soft delete + restore workflows, and
                activity logging for auditability.
              </p>
            </div>
          </motion.div>

          {/* ARCHITECTURE & SYSTEM DESIGN */}
          <motion.div variants={fadeUp}>
            <SectionHeader
              icon={Database}
              title="Architecture & System Design"
            />
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                variants={cardVariant}
                className="p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]"
              >
                <h3 className="text-xl font-semibold mb-4">
                  Frontend Architecture
                </h3>
                <ul className="space-y-3 text-[var(--color-muted-foreground)]">
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    Redux Toolkit + RTK Query for normalized state and cache
                    management
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    Centralized Axios instance with request/response
                    interceptors and automatic token refresh
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    Custom route configuration with private route protection and
                    nested layouts
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    Infinite scroll powered by IntersectionObserver with
                    deduplication logic
                  </li>
                </ul>
              </motion.div>

              <motion.div
                variants={cardVariant}
                className="p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]"
              >
                <h3 className="text-xl font-semibold mb-4">
                  Backend Architecture
                </h3>
                <ul className="space-y-3 text-[var(--color-muted-foreground)]">
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    Express.js with modular route organization and centralized
                    error handling
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    Custom ApiError + ApiResponse wrappers for consistent API
                    contracts
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    Middleware stack: auth, multer, rate limiting, and request
                    logging
                  </li>
                  <li className="flex gap-2">
                    <ArrowRight
                      className="mt-1 text-[var(--color-primary)]"
                      size={16}
                    />
                    MongoDB with careful indexing strategy for pagination and
                    filtered queries
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* AUTHENTICATION & SECURITY */}
          <motion.div variants={fadeUp}>
            <SectionHeader icon={Shield} title="Authentication & Security" />
            <div className="prose prose-invert max-w-none text-[var(--color-muted-foreground)]">
              <p>
                The authentication system is production-hardened with JWT access
                + refresh tokens stored exclusively in HTTP-only cookies.
                Refresh tokens are hashed and validated against the database.
                Sessions track device information, IP address, and user agent
                for comprehensive multi-device management.
              </p>
              <p className="mt-4">
                OTP system uses 6-digit codes with strict rate limiting (1/min,
                5/hour), attempt tracking, hashing, and automatic expiry.
                Supports forgot password, account restore, and password change
                flows. All sessions are invalidated on password reset or account
                deletion for security.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                "Google OAuth2",
                "JWT + Refresh Rotation",
                "HTTP-only Cookies",
                "Session Invalidation",
                "OTP Rate Limiting",
                "Soft Delete + Restore",
              ].map((item, i) => (
                <div
                  key={i}
                  className="px-5 py-3 bg-[var(--color-muted)]/50 rounded-2xl border border-[var(--color-border)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* DATA HANDLING & PERFORMANCE */}
          <motion.div variants={fadeUp}>
            <SectionHeader icon={Zap} title="Data Handling & Performance" />
            <div className="space-y-6">
              <p className="text-[var(--color-muted-foreground)] max-w-3xl">
                Listings support server-side pagination, sorting, and filtering
                with proper{" "}
                <code className="bg-[var(--color-muted)] px-1.5 py-0.5 rounded">
                  hasMore
                </code>{" "}
                and total count metadata. Frontend implements infinite scroll
                with deduplication to prevent duplicate cards in state during
                rapid scrolling or filter changes.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]">
                  <div className="font-mono text-xs tracking-widest text-[var(--color-primary)] mb-2">
                    PERFORMANCE TECHNIQUES
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      • IntersectionObserver + virtualized loading awareness
                    </li>
                    <li>• State deduplication on listing fetch</li>
                    <li>• Skeleton loaders with realistic shimmer</li>
                    <li>• Optimistic updates for favorites toggle</li>
                    <li>• Lazy image loading with proper aspect ratios</li>
                  </ul>
                </div>
                <div className="p-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]">
                  <div className="font-mono text-xs tracking-widest text-[var(--color-primary)] mb-2">
                    IMAGE HANDLING
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Multi-image upload via multer → temporary local storage →
                    Cloudinary upload with public_id tracking. Update flow
                    supports selective image removal and new uploads while
                    maintaining existing assets.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI SEARCH SYSTEM */}
          <motion.div variants={fadeUp}>
            <SectionHeader icon={Brain} title="AI Search System" />
            <div className="bg-gradient-to-br from-zinc-950 to-black border border-[var(--color-border)] rounded-3xl p-10">
              <div className="max-w-2xl">
                <div className="uppercase tracking-[3px] text-xs text-amber-400 mb-3">
                  INTELLIGENT QUERY PROCESSING
                </div>
                <h3 className="text-3xl font-semibold mb-6 leading-tight">
                  Natural language → Structured MongoDB query
                </h3>
                <p className="text-lg text-zinc-400">
                  Users can type queries like{" "}
                  <span className="font-mono bg-zinc-900 px-2 py-1 rounded">
                    "affordable 3BHK near city center with parking"
                  </span>
                  . The backend uses AI to extract intent (price range, bedroom
                  count, location hints, amenities) and converts them into
                  optimized MongoDB filters with relevance boosting.
                </p>
                <p className="mt-4 text-zinc-400">
                  Hybrid approach: AI parsing + traditional keyword fallback
                  ensures both flexibility and performance.
                </p>
              </div>
            </div>
          </motion.div>

          {/* USER EXPERIENCE ENGINEERING */}
          <motion.div variants={fadeUp}>
            <SectionHeader icon={Users} title="User Experience Engineering" />
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-6">
                <div className="p-7 rounded-3xl border border-[var(--color-border)]">
                  <div className="text-sm uppercase tracking-widest mb-4 text-[var(--color-primary)]">
                    Frontend Polish
                  </div>
                  <ul className="space-y-4 text-[var(--color-muted-foreground)]">
                    <li>Slide-in filter drawer with URL sync</li>
                    <li>
                      Framer Motion micro-interactions and page transitions
                    </li>
                    <li>Realistic skeleton loaders matching card layout</li>
                    <li>Dark/Light theme with CSS variables + persistence</li>
                    <li>Optimistic UI for favorites and profile updates</li>
                  </ul>
                </div>
              </div>
              <div className="md:col-span-7">
                <div className="rounded-3xl border border-[var(--color-border)] p-8 bg-[var(--color-card)]">
                  <p className="text-[var(--color-muted-foreground)]">
                    Every interaction was designed with production constraints
                    in mind: global loading states, proper error boundaries,
                    form validation feedback, and smooth state synchronization
                    between Redux and URL params.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* WHY THIS PROJECT STANDS OUT */}
          <motion.div
            variants={fadeUp}
            className="pt-8 border-t border-[var(--color-border)]"
          >
            <SectionHeader icon={Zap} title="Why This Project Stands Out" />
            <div className="max-w-3xl text-[var(--color-muted-foreground)] text-lg leading-relaxed">
              BrickNest is not a tutorial project. It is a deliberate deep-dive
              into building a complex, production-ready full-stack application
              with attention to security, performance, scalability, and
              maintainability.
            </div>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Security Depth",
                  desc: "JWT rotation, session tracking, OTP rate limiting, soft deletes, and proper token storage",
                },
                {
                  title: "Performance Focus",
                  desc: "Infinite scroll with deduplication, optimized queries, lazy loading, and careful state management",
                },
                {
                  title: "System Complexity",
                  desc: "Multi-image Cloudinary management, AI-powered hybrid search, activity logging, and multi-device session control",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  className="p-8 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors group"
                >
                  <div className="text-xl font-semibold mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* FINAL CTA */}
      <div className="border-t border-[var(--color-border)] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-[var(--color-muted-foreground)] mb-8">
              Built with engineering rigor. Ready for production challenges.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition-all active:scale-[0.985] dark:bg-white dark:text-black"
            >
              Explore BrickNest Live
              <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
