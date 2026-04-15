import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import contactImg from "../assets/Astra.png";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    idea: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "budget" && value && !/^\d+$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validation = () => {
    const required = ["name", "email", "service", "idea"];
    const newErrors = {};

    required.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "Required";
      }
    });

    if (formData.service !== "others" && !formData.budget.trim()) {
      newErrors.budget = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submissionHandler = async (e) => {
    e.preventDefault();
    if (!validation()) return;

    setStatus("sending");

    try {
      await emailjs.send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        {
          ...formData,
          from_name: formData.name,
          reply_to: formData.email,
        },
        import.meta.env.VITE_PUBLIC_KEY,
      );

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        service: "",
        budget: "",
        idea: "",
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] py-16 px-4">
      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-stretch">
        {/* LEFT IMAGE */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center  
          rounded-2xl p-6"
        >
          <motion.img
            variants={fadeLeft}
            src={contactImg}
            alt="Contact"
            className="w-64 md:w-80 object-contain"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="bg-[var(--color-card)] border border-[var(--color-border)] 
          rounded-2xl p-6 md:p-8 shadow-lg"
        >
          <motion.h2
            variants={fadeRight}
            className="text-2xl md:text-3xl font-bold mb-6 
            bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
          >
            Let's Build Something Real
          </motion.h2>

          <form onSubmit={submissionHandler} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={changeHandler}
              className={`p-3 rounded-lg bg-[var(--color-background)] border ${
                errors.name ? "border-red-500" : "border-[var(--color-border)]"
              }`}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={changeHandler}
              className={`p-3 rounded-lg bg-[var(--color-background)] border ${
                errors.email ? "border-red-500" : "border-[var(--color-border)]"
              }`}
            />

            <select
              name="service"
              value={formData.service}
              onChange={changeHandler}
              className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]"
            >
              <option value="">Select Service</option>
              <option value="Website Creation">Website</option>
              <option value="Mobile App Creation">Application</option>
              <option value="others">Others</option>
            </select>

            {formData.service && formData.service !== "others" && (
              <input
                type="text"
                name="budget"
                placeholder="Budget"
                value={formData.budget}
                onChange={changeHandler}
                className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]"
              />
            )}

            <textarea
              name="idea"
              rows={4}
              placeholder="Describe your requirement"
              value={formData.idea}
              onChange={changeHandler}
              className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]"
            />

            {status && (
              <p className="text-sm text-center">
                {status === "sending" && "Sending..."}
                {status === "success" && (
                  <span className="text-green-500">Message sent ✔</span>
                )}
                {status === "error" && (
                  <span className="text-red-500">Something went wrong</span>
                )}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              disabled={status === "sending"}
              className="py-3 rounded-lg font-medium 
              bg-gradient-to-r from-indigo-500 to-purple-500 
              text-white"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
