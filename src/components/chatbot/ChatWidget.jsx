import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaPaperPlane, FaRegCommentDots } from "react-icons/fa";
import { sendMessage } from "../../services/chatService";

const STARTER_QUESTIONS = [
  "What projects has John built?",
  "What is John's strongest AI skill?",
  "Which project best shows production AI?",
  "Does John work with FastAPI?",
  "What kind of roles is John suited for?",
];

const RECRUITER_STARTER_QUESTIONS = [
  "Why should we hire John?",
  "What is John's notice period/availability?",
  "What are John's contact details?",
  "Can John work on remote/distributed teams?",
  "Show me John's ML deployment skills.",
];

const MAX_CHARS = 1000;

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full bg-accent/60"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Parses Markdown links: [Text](URL) and bold text: **Text** inside message text and formats them as standard React elements
const parseMarkdown = (text) => {
  if (!text) return "";
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    // 1. Check if it matches a Markdown link [Link Text](URL)
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline hover:text-accent/80 transition-colors font-semibold"
        >
          {linkText}
        </a>
      );
    }
    // 2. Check if it matches double asterisks bold **bold text**
    const boldMatch = part.match(/\*\*([^*]+)\*\*/);
    if (boldMatch) {
      const boldText = boldMatch[1];
      return (
        <strong key={index} className="font-extrabold text-white">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

const MessageBubble = ({ role, content, sources }) => {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-accent text-background rounded-br-md font-medium"
            : "bg-white/5 border border-white/5 text-gray-200 rounded-bl-md"
        }`}
      >
        {isUser ? content : parseMarkdown(content)}

        {/* Clickable RAG Citation Sources */}
        {!isUser && sources && sources.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-gray-500 font-medium mr-0.5">Sources:</span>
            {sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-white/10 border border-white/10 text-accent hover:bg-accent/20 hover:border-accent/30 transition-all font-medium"
              >
                {src.title || "Reference"}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [mode, setMode] = useState("default"); // "default" | "hire"
  const [showWizard, setShowWizard] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Delay showing the greeting popover by 2.5 seconds on mount
    const t = setTimeout(() => {
      if (!isOpen) {
        setShowGreeting(true);
      }
    }, 2500);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
    }
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || loading) return;

      setInput("");
      setError(null);

      const userMsg = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const replyObj = await sendMessage(trimmed, mode);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: replyObj.reply, sources: replyObj.sources },
        ]);
      } catch (err) {
        setError(err.message || "Failed to get a response.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process that right now. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, mode]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starterQuestions = mode === "hire" ? RECRUITER_STARTER_QUESTIONS : STARTER_QUESTIONS;

  return (
    <>
      {/* Welcome Greeting Popover bubble */}
      <AnimatePresence>
        {!isOpen && showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-40 right-6 lg:bottom-24 z-50 w-[280px] p-4 rounded-2xl border border-accent/40 bg-secondary/95 backdrop-blur-md text-left shadow-[0_0_15px_rgba(255,215,0,0.15)] cursor-pointer hover:border-accent hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] transition-all duration-300"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreeting(false);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Dismiss greeting"
            >
              <FaTimes className="text-[10px]" />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] font-bold text-accent uppercase tracking-wider">AI Portfolio Agent</span>
            </div>
            <p className="text-gray-200 text-xs font-medium leading-relaxed">
              Hi there! 👋 Ask me any questions about John's technical skills, experience, or deep learning projects!
            </p>
            {/* Speech bubble arrow pointer */}
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-secondary border-r border-b border-accent/40 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button — positioned above mobile nav hamburger on small screens */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 lg:bottom-6 z-50 w-14 h-14 rounded-full bg-accent text-background shadow-lg shadow-accent/30 flex items-center justify-center hover:shadow-accent/50 transition-shadow"
            aria-label="Open chat assistant"
          >
            <FaRegCommentDots className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[min(600px,calc(100vh-6rem))] flex flex-col rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${
              mode === "hire"
                ? "border-accent/40 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                : "border-white/10 shadow-black/40"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-secondary/50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    mode === "hire"
                      ? "bg-accent/25 border border-accent shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                      : "bg-accent/10 border border-accent/30"
                  }`}
                >
                  <FaRobot className="text-accent text-sm" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold">Ask Jermaine</h3>
                  <p className="text-gray-500 text-[10px]">Portfolio Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* 💼 Hire Jermaine Recruiter Toggle Pill */}
                <button
                  onClick={() => {
                    setMode((prev) => (prev === "hire" ? "default" : "hire"));
                    setError(null);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 flex items-center gap-1 ${
                    mode === "hire"
                      ? "bg-accent text-background border-accent shadow-sm shadow-accent/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  💼 {mode === "hire" ? "Recruiter" : "Hire Me"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>

            {/* Recruiter Mode Active Banner */}
            {mode === "hire" && (
              <div className="bg-accent/10 border-b border-accent/25 px-5 py-2.5 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Recruiter Mode Active</span>
                </div>
                <span className="text-[9px] text-gray-400 font-medium">Recruitment details prioritized</span>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/10">
              {/* Welcome message & Wizards */}
              {messages.length === 0 && !loading && (
                <div className="my-auto">
                  {showWizard ? (
                    /* Project Recommendation Wizard Screen */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-4 gap-3 w-full"
                    >
                      <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center">
                        <span className="text-xl">🚀</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-0.5">Project Selector</h4>
                        <p className="text-gray-400 text-[11px] leading-relaxed max-w-[280px]">
                          Choose an engineering domain to inspect John's premium production systems:
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 w-full max-w-[320px] mt-2">
                        {[
                          {
                            label: "NLP & Language",
                            icon: "✍️",
                            query: "Recommend Jermaine's projects on Natural Language Processing (NLP) and Pidgin next-word prediction.",
                          },
                          {
                            label: "Computer Vision",
                            icon: "👁️",
                            query: "Recommend Jermaine's projects on Computer Vision, EfficientNet, and CineMatch recommendations.",
                          },
                          {
                            label: "RAG & LLMs",
                            icon: "🧠",
                            query: "Recommend Jermaine's projects on Retrieval-Augmented Generation (RAG) and chatbot systems.",
                          },
                          {
                            label: "Data Science",
                            icon: "📊",
                            query: "Recommend Jermaine's projects on Credit Scoring, Predictive modeling, and Data Analytics.",
                          },
                        ].map((cat) => (
                          <button
                            key={cat.label}
                            onClick={() => {
                              setShowWizard(false);
                              handleSend(cat.query);
                            }}
                            className="p-3 rounded-xl border border-white/5 bg-white/5 text-left hover:bg-accent/5 hover:border-accent/40 transition-all duration-300 flex flex-col gap-1.5 group"
                          >
                            <span className="text-base">{cat.icon}</span>
                            <span className="text-[10px] font-bold text-white group-hover:text-accent transition-colors leading-tight">{cat.label}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowWizard(false)}
                        className="text-gray-500 hover:text-gray-300 text-[10px] mt-2 underline transition-colors"
                      >
                        Cancel and Go Back
                      </button>
                    </motion.div>
                  ) : (
                    /* Regular Welcome Message Screen */
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center text-center py-6 gap-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <FaRobot className="text-accent text-xl" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-1 px-4">
                          {mode === "hire"
                            ? "Welcome Recruiter! 👋 Jermaine is ready for hire."
                            : "Hi! I'm Jermaine's AI assistant."}
                        </h4>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-[260px] mx-auto px-2">
                          {mode === "hire"
                            ? "Ask me about John's production readiness, core strengths, notice period, or scheduling a meeting."
                            : "Ask me about John's deep learning projects, Python skills, ML pipelines, or technical background."}
                        </p>
                      </div>

                      {/* Recommend Projects Call-To-Action Card */}
                      <button
                        onClick={() => setShowWizard(true)}
                        className="w-full max-w-[280px] py-2 px-4 rounded-xl bg-accent/10 border border-accent/30 text-accent font-bold text-xs flex items-center justify-center gap-2 hover:bg-accent/20 hover:border-accent transition-all duration-300 shadow-md shadow-accent/5"
                      >
                        🚀 Recommend Projects Wizard
                      </button>

                      {/* Starter Questions */}
                      <div className="flex flex-wrap gap-1.5 justify-center mt-2 px-2 max-w-[340px]">
                        {starterQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSend(q)}
                            className="px-3 py-1.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-accent/35 hover:bg-accent/5 transition-all"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Message Bubbles */}
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} {...msg} />
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 pb-3 pt-2 border-t border-white/5 bg-secondary/20">
              {/* Error display */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-[10px] mb-2 px-1 font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === "hire" ? "Ask about availability, background..." : "Ask me anything..."}
                  rows={1}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-accent/30 transition-colors max-h-20 overflow-y-auto"
                  aria-label="Chat message input"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-accent text-background flex items-center justify-center hover:bg-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Send message"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>

              {/* Character count + Disclaimer */}
              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-gray-600 text-[9px] font-medium leading-none">
                  AI assistant may make mistakes.
                </p>
                <span className="text-gray-600 text-[9px] font-medium leading-none">
                  {input.length}/{MAX_CHARS}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
