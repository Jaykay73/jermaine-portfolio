import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DownloadCVButton from "../common/DownloadCVButton";
import LottieAnimation from "./LottieAnimation";

const roles = [
  "a Data Scientist",
  "a Machine Learning Engineer",
  "an AI Engineer",
];

export default function HeroMain() {
  const greeting = "Hi, I'm John.";
  const [displayedGreeting, setDisplayedGreeting] = useState("");
  const [greetIndex, setGreetIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (greetIndex < greeting.length) {
      const t = setTimeout(() => {
        setDisplayedGreeting((prev) => prev + greeting[greetIndex]);
        setGreetIndex((i) => i + 1);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [greetIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[95vh] w-full">
      <motion.div
        className="relative flex flex-col text-center items-center justify-center text-primary px-4"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        <LottieAnimation />
        <h1 className="text-3xl xl:text-5xl font-medium">
          {displayedGreeting}
          <span className="text-accent animate-blink">|</span>
        </h1>

        {/* Rotating Role Badge */}
        <motion.div
          className="relative mt-2 mb-4 h-8 xl:h-10 overflow-hidden z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={roles[roleIndex]}
              className="text-md xl:text-xl text-accent font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {`I'm ${roles[roleIndex]}`}
            </motion.h2>
          </AnimatePresence>
        </motion.div>

        <p className="text-sm xl:text-lg max-w-[500px] px-2 xl:max-w-[800px] my-4 text-primary/80">
          Obsessed with building the future
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
        >
          <DownloadCVButton />
        </motion.div>
      </motion.div>

      {/* Scroll indicator — lets users know there's more content below */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-accent transition-colors cursor-pointer z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        onClick={() => {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        aria-label="Scroll to explore more"
      >
        <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.button>
    </div>
  );
}
