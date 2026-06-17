import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaYoutube, FaFileAlt, FaGraduationCap, FaBook, FaCode, FaLaptopCode, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";

const LOCKEDIN_API_URL = "https://jaykay73-lockedin.hf.space";

const getResourceIcon = (type) => {
  switch (type) {
    case "youtube_video":
      return <FaYoutube className="text-red-400 text-sm flex-shrink-0" />;
    case "article":
      return <FaFileAlt className="text-blue-400 text-sm flex-shrink-0" />;
    case "free_course":
      return <FaGraduationCap className="text-green-400 text-sm flex-shrink-0" />;
    case "documentation":
      return <FaCode className="text-cyan-400 text-sm flex-shrink-0" />;
    case "free_book":
      return <FaBook className="text-amber-400 text-sm flex-shrink-0" />;
    default:
      return <FaLaptopCode className="text-gray-400 text-sm flex-shrink-0" />;
  }
};

const LockedInDemo = () => {
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    const trimmed = skill.trim();
    if (!trimmed) {
      setError("Please enter a skill or topic you want to learn.");
      return;
    }

    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const response = await fetch(`${LOCKEDIN_API_URL}/api/v1/roadmaps/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill: trimmed,
          user_level: "complete beginner",
          goal: "learn the skill step by step and build practical confidence",
          time_commitment: "3 to 5 hours per week",
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error (${response.status})`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setRoadmap(resJson.data);
      } else {
        throw new Error("Invalid response format received from backend.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Hugging Face Space might be cold starting. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full text-left"
    >
      <div className="bg-secondary/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-gray-400 text-xs font-mono ml-2">
            lockedin-api-v1-roadmap.py — DeepSeek + Tavily RAG
          </span>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Input Area */}
          <div className="flex flex-col gap-3">
            <label htmlFor="skill-input" className="text-white text-sm font-medium">
              Enter any skill or topic you want to learn
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="skill-input"
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g. React Development, Data Analytics, Woodworking, Pottery..."
                className="flex-grow bg-background/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !skill.trim()}
                className="sm:w-44 px-5 py-3 rounded-lg text-sm font-bold text-background bg-accent hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaPlay className="text-xs" />
                    Generate Roadmap
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Display */}
          <AnimatePresence>
            {roadmap && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col gap-6 border-t border-white/5 pt-6"
              >
                {/* Meta details */}
                <div className="flex flex-col md:flex-row justify-between gap-4 bg-white/[0.01] p-4 border border-white/5 rounded-xl">
                  <div>
                    <h3 className="text-accent font-bold text-lg">{roadmap.skill}</h3>
                    <p className="text-gray-400 text-xs mt-1">Duration: <span className="text-white font-semibold">{roadmap.estimated_total_duration}</span></p>
                  </div>
                  <div className="text-xs text-gray-500 self-end">
                    Powered by DeepSeek LLM
                  </div>
                </div>

                {/* Overview */}
                <div className="bg-accent/5 border border-accent/10 rounded-xl p-5">
                  <h4 className="text-white font-semibold text-sm mb-2">Roadmap Overview</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{roadmap.overview}</p>
                </div>

                {/* Phases Timeline */}
                <div className="flex flex-col gap-8 mt-4 relative pl-6 before:absolute before:left-2 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10">
                  {roadmap.phases.map((phase, phaseIdx) => (
                    <div key={phaseIdx} className="relative flex flex-col gap-4">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 border-accent bg-background" />

                      {/* Phase Header */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent uppercase font-mono">
                          Phase {phaseIdx + 1}
                        </span>
                        <h4 className="text-white font-bold text-md">{phase.title}</h4>
                        <span className="text-xs text-gray-500 flex items-center gap-1.5 ml-auto">
                          <FaCalendarAlt className="text-[10px]" /> {phase.estimated_duration}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400">
                        Level: <span className="text-gray-200 capitalize font-medium">{phase.level}</span> | Goal: <span className="text-gray-200">{phase.goal}</span>
                      </div>

                      {/* Phase Nodes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {phase.nodes.map((node, nodeIdx) => (
                          <div key={nodeIdx} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col gap-3 hover:border-white/10 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-white font-semibold text-sm line-clamp-1">{node.title}</h5>
                              <span className="text-[10px] text-accent font-semibold font-mono whitespace-nowrap bg-accent/5 px-2 py-0.5 rounded">
                                {node.estimated_completion_time}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                              {node.description}
                            </p>

                            {/* Resources */}
                            <div className="mt-auto pt-3 border-t border-white/5 flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Free Resources:</span>
                              {node.resources?.map((res, resIdx) => (
                                <a
                                  key={resIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs text-gray-300 hover:text-accent hover:underline transition-all line-clamp-1"
                                >
                                  {getResourceIcon(res.type)}
                                  <span className="truncate">{res.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Capstone Project */}
                      {phase.project && (
                        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 mt-2 flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-accent font-bold text-xs">
                            <FaCheckCircle className="text-xs" /> Capstone Project: {phase.project.title}
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">{phase.project.brief}</p>
                          {phase.project.tools_needed && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-[10px] text-gray-500 font-bold uppercase self-center">Tools:</span>
                              {phase.project.tools_needed.map((tool, idx) => (
                                <span key={idx} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5 font-mono">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer info */}
          <p className="text-gray-500 text-[11px] mt-2 text-center">
            This demo communicates directly with my FastAPI model backend hosted on{" "}
            <a
              href="https://huggingface.co/spaces/Jaykay73/LockedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 hover:text-accent transition-colors underline underline-offset-2"
            >
              Hugging Face Spaces
            </a>
            . Generating a new roadmap runs live search and takes about 10-15 seconds.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LockedInDemo;
