import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaFileMedical, FaFilm, FaGavel, FaCreditCard, FaChartLine } from "react-icons/fa";
import NextWordDemo from "./NextWordDemo";
import ComingSoonModelCard from "./ComingSoonModelCard";
import BitCheckDemo from "./BitCheckDemo";
import LockedInDemo from "./LockedInDemo";

const comingSoonModels = [
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
      "Brain tumor classification from MRI scans using EfficientNetB0 transfer learning.",
    color: "text-rose-400",
    icon: FaFileMedical,
  },
];

const PlaygroundSection = () => {
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
          Don't just read about my models — test them live. Type a phrase and watch the predictions flow in real time.
        </p>
      </motion.div>

      {/* Active Model — Pidgin Predictor */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-bold tracking-wider uppercase">
            Live Model
          </span>
          <span className="text-white text-sm font-semibold">
            — Nigerian Pidgin Next-Word Predictor
          </span>
        </motion.div>

        <NextWordDemo />
      </div>

      {/* Coming Soon Models */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <span className="text-gray-500 text-xs font-bold tracking-wider uppercase">
            More Models Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comingSoonModels.map((model) => (
            <ComingSoonModelCard key={model.title} {...model} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PlaygroundSection;
