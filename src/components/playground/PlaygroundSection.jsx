import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaFileMedical, FaFilm, FaGavel, FaShieldAlt, FaRoad } from "react-icons/fa";
import NextWordDemo from "./NextWordDemo";
import BitCheckDemo from "./BitCheckDemo";
import LockedInDemo from "./LockedInDemo";
import ComingSoonModelCard from "./ComingSoonModelCard";

const playgroundModels = [
  {
    title: "AI Resume Optimizer",
    category: "AI | Career Tech",
    description:
      "Skill gap analysis and tailored cover letter generation powered by Gemini 2.0 Flash.",
    color: "text-cyan-400",
    icon: FaRocket,
  },
  {
    title: "CineMatch API",
    category: "Recommendation Engine",
    description:
      "Semantic movie recommendations using vector embeddings and FAISS similarity search.",
    color: "text-purple-400",
    icon: FaFilm,
  },
  {
    title: "Legal Document Analyzer",
    category: "NLP | RAG System",
    description:
      "Contract analysis with RAG pipeline, clause extraction, and cosine similarity ranking.",
    color: "text-emerald-400",
    icon: FaGavel,
  },
  {
    title: "Brain Tumor MRI Classifier",
    category: "Medical AI",
    description:
      "Brain tumor classification from MRI scans using EfficientNetB0 transfer learning. Quantized and deployed on a seamless mobile application.",
    color: "text-rose-400",
    icon: FaFileMedical,
  },
];

const PlaygroundSection = () => {
  const [activeModel, setActiveModel] = useState("pidgin");

  return (
    <div className="pt-20 pb-16 container mx-auto px-6 relative z-10" id="playground">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-4 text-center mb-16"
      >
        <span className="text-accent text-sm tracking-widest uppercase font-semibold">
          Interactive Demos
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          AI <span className="text-accent">Playground</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mt-4">
          Don't just read about my models — test them live from the comfort of my website. Select a model below to experience it in real-time.
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 bg-secondary/20 backdrop-blur-sm border border-white/5 p-2 rounded-2xl max-w-3xl mx-auto">
        <button
          onClick={() => setActiveModel("pidgin")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-all ${
            activeModel === "pidgin"
              ? "bg-accent text-background shadow-lg shadow-accent/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <FaRocket />
          <span>Pidgin Predictor</span>
        </button>
        <button
          onClick={() => setActiveModel("bitcheck")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-all ${
            activeModel === "bitcheck"
              ? "bg-teal-400 text-background shadow-lg shadow-teal-400/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <FaShieldAlt />
          <span>BitCheck Authenticator</span>
        </button>
        <button
          onClick={() => setActiveModel("lockedin")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-all ${
            activeModel === "lockedin"
              ? "bg-indigo-400 text-background shadow-lg shadow-indigo-400/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <FaRoad />
          <span>LockedIn Roadmaps</span>
        </button>
      </div>

      {/* Active Model Content */}
      <div className="mb-16 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeModel === "pidgin" && (
            <motion.div
              key="pidgin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-bold tracking-wider uppercase">
                  Live Model
                </span>
                <span className="text-white text-sm font-semibold font-mono">
                  — Nigerian Pidgin Next-Word Predictor
                </span>
              </div>
              <NextWordDemo />
            </motion.div>
          )}

          {activeModel === "bitcheck" && (
            <motion.div
              key="bitcheck"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-teal-400 text-xs font-bold tracking-wider uppercase">
                  Live Model
                </span>
                <span className="text-white text-sm font-semibold font-mono">
                  — BitCheck Image Authenticator (EfficientNet-B0 + Forensics)
                </span>
              </div>
              <BitCheckDemo />
            </motion.div>
          )}

          {activeModel === "lockedin" && (
            <motion.div
              key="lockedin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-indigo-400 text-xs font-bold tracking-wider uppercase">
                  Live Service
                </span>
                <span className="text-white text-sm font-semibold font-mono">
                  — LockedIn AI Roadmap Generator (DeepSeek + Tavily RAG)
                </span>
              </div>
              <LockedInDemo />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coming Soon Models */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-xs font-bold tracking-wider uppercase">
            Model Sandbox & Playground
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {playgroundModels.map((model) => (
            <ComingSoonModelCard key={model.title} {...model} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PlaygroundSection;
