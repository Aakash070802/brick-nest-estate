import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const Section = ({ title, children }) => (
  <motion.div variants={fadeUp} className="mb-12">
    <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-3">
      {title}
    </h2>
    <p className="text-[var(--color-muted-foreground)] leading-relaxed">
      {children}
    </p>
  </motion.div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* HERO */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)] mb-4"
          >
            BrickNest — Engineering Focused Property Platform
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[var(--color-muted-foreground)] max-w-3xl"
          >
            This is not just a UI project. It is a full-stack oriented frontend
            system designed with real-world constraints like authentication,
            session management, scalability, and data consistency.
          </motion.p>
        </motion.div>

        {/* ARCHITECTURE */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <Section title="Architecture">
            Built using React with Vite for fast builds and modern tooling. The
            application follows a modular structure separating API services, UI
            components, and state management. Redux Toolkit with persistence is
            used to maintain global state across sessions while avoiding stale
            loading states using custom transforms.
          </Section>

          <Section title="API Layer & Networking">
            A centralized Axios instance handles all API communication with
            request/response interceptors. It includes a request counter-based
            global loader system and automatic token refresh logic using a
            secondary client to prevent infinite retry loops. This ensures
            stable session handling without breaking UX.
          </Section>

          <Section title="Authentication System">
            Implements email/password login, Google OAuth integration, refresh
            token flow, and multi-device logout. Additional flows include OTP
            based password reset and account restoration, simulating real-world
            production auth systems.
          </Section>

          <Section title="Data Handling & Performance">
            Supports server-side pagination with infinite scroll using
            IntersectionObserver. Includes deduplication logic to prevent
            duplicate renders and maintains consistent UI state during async
            operations.
          </Section>

          <Section title="User Experience Engineering">
            Designed with skeleton loaders, animated transitions using Framer
            Motion, and a dynamic filtering system. The filter drawer updates
            query parameters efficiently without unnecessary re-renders.
          </Section>

          <Section title="Theme System">
            Custom theme implementation using CSS variables with real-time DOM
            synchronization via MutationObserver. Ensures consistent UI updates
            across components without prop drilling.
          </Section>

          <Section title="Why This Project Matters">
            This project focuses on solving real engineering problems rather
            than just building UI. It demonstrates understanding of state
            management, API reliability, authentication flows, and scalable
            frontend architecture.
          </Section>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 text-center"
        >
          <a
            href="/"
            className="px-6 py-3 rounded-xl 
            bg-gradient-to-r from-indigo-500 to-purple-500 
            text-white font-medium shadow-md hover:scale-105 transition"
          >
            Explore the Application
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
