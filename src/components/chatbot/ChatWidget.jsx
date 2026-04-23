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

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-accent text-background rounded-br-md font-medium"
            : "bg-white/5 border border-white/5 text-gray-200 rounded-bl-md"
        }`}
      >
        {content}
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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
        const reply = await sendMessage(trimmed);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
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
    [input, loading]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
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
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[min(600px,calc(100vh-6rem))] flex flex-col rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <FaRobot className="text-accent text-sm" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold">Ask Jermaine</h3>
                  <p className="text-gray-500 text-[10px]">Portfolio Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/10">
              {/* Welcome message */}
              {messages.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-6 gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <FaRobot className="text-accent text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">
                      Hi! I'm Jermaine's AI assistant.
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-[260px]">
                      Ask me about John's projects, skills, experience, or engineering approach.
                    </p>
                  </div>

                  {/* Starter Questions */}
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-accent/30 hover:bg-accent/5 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
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
            <div className="px-4 pb-3 pt-2 border-t border-white/5">
              {/* Error display */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-[10px] mb-2 px-1"
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
                  placeholder="Ask me anything..."
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
                <p className="text-gray-600 text-[9px]">
                  This assistant is experimental and may make mistakes.
                </p>
                <span className="text-gray-600 text-[9px]">
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
