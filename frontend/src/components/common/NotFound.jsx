import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ghost from "../../assets/boo.png";

const container = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        {/* 404 */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="text-[90px] md:text-[130px] font-bold text-[var(--color-foreground)] opacity-60">
            4
          </span>

          {/* Ghost */}
          <motion.img
            src={ghost}
            alt="ghost"
            className="w-20 md:w-30 opacity-80 rounded-full border-4 border-[var(--color-border)]"
            animate={{ y: [-6, 6] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          />

          <span className="text-[90px] md:text-[130px] font-bold text-[var(--color-foreground)] opacity-60">
            4
          </span>
        </div>

        {/* Title */}
        <motion.h1
          variants={item}
          className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)]"
        >
          Page not found
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-3 text-[var(--color-muted-foreground)]"
        >
          This route doesn’t exist or got removed.
        </motion.p>

        {/* CTA */}
        <motion.div variants={item} className="mt-8">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl font-medium text-[var(--color-primary-foreground)]"
            style={{ background: "var(--color-primary)" }}
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
