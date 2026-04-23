import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaLightbulb, FaBrain, FaChartBar } from "react-icons/fa";

const NEXTWORD_API_URL = import.meta.env.VITE_NEXTWORD_API_BASE_URL || "https://jaykay73-nextword-pidgin-api.hf.space";
const REQUEST_TIMEOUT = 25000;

const PredictionColumn = ({ title, icon: Icon, predictions, color }) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`text-lg ${color}`} />
      <h4 className="text-white font-semibold text-sm">{title}</h4>
    </div>
    <div className="flex flex-col gap-2">
      {predictions.map((pred, idx) => (
        <motion.div
          key={`${pred.word}-${idx}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center justify-between bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 hover:border-accent/20 transition-colors"
        >
          <span className="text-white font-medium text-sm truncate mr-3">
            {pred.word}
          </span>
          <span className={`text-xs font-mono font-semibold ${color} whitespace-nowrap`}>
            {(pred.probability * 100).toFixed(2)}%
          </span>
        </motion.div>
      ))}
      {predictions.length === 0 && (
        <p className="text-gray-500 text-sm italic">No predictions</p>
      )}
    </div>
  </div>
);

const NextWordDemo = () => {
  const [context, setContext] = useState("");
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = useCallback(async () => {
    const trimmed = context.trim();
    if (!trimmed) {
      setError("Please enter a Nigerian Pidgin phrase first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${NEXTWORD_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: trimmed,
          top_k: topK,
          model: "both",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          response.status === 503
            ? "The model is waking up (cold start). Please try again in a few seconds."
            : `API error (${response.status}): ${errText || "Unknown error"}`
        );
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        setError(
          "Request timed out. The model may be cold-starting on Hugging Face. Please wait a moment and try again."
        );
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [context, topK]);

  const handleTryExample = () => {
    setContext("how far my");
    setError(null);
    setResults(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePredict();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
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
            pidgin-predictor.py — LSTM + Trigram
          </span>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Input Area */}
          <div className="flex flex-col gap-3">
            <label htmlFor="pidgin-input" className="text-white text-sm font-medium">
              Enter Nigerian Pidgin text
            </label>
            <textarea
              id="pidgin-input"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a Nigerian Pidgin phrase, e.g. 'how far my'"
              rows={2}
              maxLength={500}
              className="w-full bg-background/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 font-mono text-sm resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              aria-label="Nigerian Pidgin text input"
              disabled={loading}
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Top-K Selector */}
            <div className="flex items-center gap-3">
              <label htmlFor="topk-select" className="text-gray-400 text-xs font-medium whitespace-nowrap">
                Top-K:
              </label>
              <select
                id="topk-select"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                disabled={loading}
                className="bg-background/80 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent/50 cursor-pointer appearance-none"
                aria-label="Number of predictions"
              >
                {[3, 5, 7, 10].map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={handleTryExample}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Try example phrase"
              >
                <FaLightbulb className="text-xs" />
                Try example
              </button>
              <button
                onClick={handlePredict}
                disabled={loading || !context.trim()}
                className="px-5 py-2 rounded-lg text-sm font-bold text-background bg-accent hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-accent/20"
                aria-label="Predict next word"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Predicting...
                  </>
                ) : (
                  <>
                    <FaPlay className="text-xs" />
                    Predict Next Word
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-300 text-sm"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Context echo */}
                <div className="mb-5 flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Context:</span>
                  <code className="text-accent text-sm font-mono bg-accent/10 px-3 py-1 rounded-lg">
                    "{results.context}"
                  </code>
                </div>

                {/* Two-column results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PredictionColumn
                    title="LSTM Predictions"
                    icon={FaBrain}
                    predictions={results.lstm || []}
                    color="text-purple-400"
                  />
                  <PredictionColumn
                    title="Trigram Predictions"
                    icon={FaChartBar}
                    predictions={results.trigram || []}
                    color="text-cyan-400"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer info */}
          <p className="text-gray-500 text-[11px] mt-2 text-center">
            This demo calls my FastAPI model backend hosted on{" "}
            <a
              href="https://huggingface.co/spaces/Jaykay73/nextword-pidgin-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/60 hover:text-accent transition-colors underline underline-offset-2"
            >
              Hugging Face Spaces
            </a>
            . First request may be slow due to cold start.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NextWordDemo;
