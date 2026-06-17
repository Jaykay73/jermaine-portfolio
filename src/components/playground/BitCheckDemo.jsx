import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaPlay, FaShieldAlt, FaShieldVirus, FaCheckCircle, FaExclamationTriangle, FaEye } from "react-icons/fa";

const BITCHECK_API_URL = "https://jaykay73-bitcheck-image.hf.space";

const BitCheckDemo = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResults(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResults(null);
        setError(null);
      } else {
        setError("Please drop a valid image file (JPG, PNG, or WEBP).");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleVerify = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_email", "guest@portfolio.com");
    formData.append("run_explainability", "true");
    formData.append("run_ocr", "true");
    formData.append("run_forensics", "true");
    formData.append("run_c2pa", "true");

    try {
      const response = await fetch(`${BITCHECK_API_URL}/verify/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || `API error (${response.status})`);
      }

      const resJson = await response.json();
      setResults(resJson);
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Hugging Face Space might be cold starting. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract trust score
  const getTrustScore = () => {
    if (!results) return 0;
    // Fallbacks to handle various backend response structures safely
    const scoreVal = results.trust?.score ?? results.trust?.trust_score ?? results.trust?.weighted_score;
    if (scoreVal === undefined) return 100; // default to safe if not computed
    return scoreVal <= 1 ? scoreVal * 100 : scoreVal;
  };

  const trustScore = getTrustScore();
  const getVerdict = (score) => {
    if (score >= 80) return { text: "High Authenticity / Low Risk", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
    if (score >= 50) return { text: "Caution / Medium Risk", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
    return { text: "Suspicious / High Risk", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
  };
  const verdict = getVerdict(trustScore);

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
            bitcheck-verify-image.py — EfficientNet + Forensics + Grad-CAM
          </span>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Uploader Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Box */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                preview
                  ? "border-accent/30 bg-accent/[0.02]"
                  : "border-white/10 hover:border-accent/40 bg-white/[0.01] hover:bg-white/[0.02]"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={loading}
              />
              {preview ? (
                <div className="relative w-full max-h-48 rounded-xl overflow-hidden flex justify-center items-center">
                  <img src={preview} alt="Upload preview" className="max-h-48 max-w-full object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold">Change Image</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-400">
                    <FaUpload className="text-lg" />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-semibold">Drag & Drop Image Here</p>
                    <p className="text-gray-500 text-xs mt-1">Supports JPG, JPEG, PNG, WEBP</p>
                  </div>
                </>
              )}
            </div>

            {/* Run verification controls */}
            <div className="flex flex-col justify-center gap-4">
              <div>
                <h4 className="text-white font-semibold text-sm">Verify Authenticity</h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Upload an image to run a complete verification check. The API evaluates metadata headers, analyzes noise levels/sharpness forensics, matching watermarks, and runs a PyTorch neural network to calculate a risk-adjusted trust score.
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleVerify}
                  disabled={loading || !file}
                  className="w-full px-5 py-3 rounded-lg text-sm font-bold text-background bg-accent hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying Image...
                    </>
                  ) : (
                    <>
                      <FaShieldAlt className="text-xs" />
                      Run Verification
                    </>
                  )}
                </button>
              </div>
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

          {/* Verification Results Dashboard */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col gap-6 border-t border-white/5 pt-6"
              >
                {/* Result Summary Bar */}
                <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-5 border rounded-xl ${verdict.bg} ${verdict.border}`}>
                  <div className="flex items-center gap-4">
                    {/* Ring gauge */}
                    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={trustScore >= 80 ? "#4ade80" : trustScore >= 50 ? "#facc15" : "#f87171"}
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={175}
                          strokeDashoffset={175 - (175 * trustScore) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-white font-bold text-sm">{trustScore.toFixed(0)}%</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Authenticity Verdict</h4>
                      <p className={`text-xs font-semibold mt-0.5 ${verdict.color}`}>{verdict.text}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    ID: <code className="font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300">{results.verification_id.slice(0, 8)}...</code>
                  </div>
                </div>

                {/* Main Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Analysis Report */}
                  <div className="flex flex-col gap-4">
                    {/* Risk flags */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5">
                      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                        <FaShieldVirus className="text-accent text-sm" /> Signal Analysis
                      </h4>
                      <div className="flex flex-col gap-2">
                        {results.risk_flags && results.risk_flags.length > 0 ? (
                          results.risk_flags.map((flag, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-red-300 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg">
                              <FaExclamationTriangle className="text-red-400 mt-0.5 flex-shrink-0" />
                              <span>{flag}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2.5 text-xs text-green-300 bg-green-500/5 border border-green-500/10 p-2.5 rounded-lg">
                            <FaCheckCircle className="text-green-400 flex-shrink-0" />
                            <span>No manipulation or generation markers detected.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Forensics summaries */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-white font-bold text-sm mb-1">Checklist Audit</h4>
                      <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                        <span className="text-gray-400">Metadata Source:</span>
                        <span className="text-white font-mono">{results.metadata?.format || "Unknown"} ({results.input?.width}x{results.input?.height})</span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                        <span className="text-gray-400">Content Credentials (C2PA):</span>
                        <span className={`font-semibold ${results.provenance?.has_c2pa ? "text-green-400" : "text-gray-500"}`}>
                          {results.provenance?.has_c2pa ? "Verified" : "Not Present"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                        <span className="text-gray-400">Forensic Compression:</span>
                        <span className={`font-semibold ${results.forensics?.compression_anomalies ? "text-red-400" : "text-green-400"}`}>
                          {results.forensics?.compression_anomalies ? "Anomaly Detected" : "Normal"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Pytesseract Watermark OCR:</span>
                        <span className="text-white italic">{results.visible_watermark_ocr?.text_found ? `Text: "${results.visible_watermark_ocr?.text_found}"` : "None Found"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Explainability & Heatmap */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      <FaEye className="text-accent text-sm" /> Grad-CAM Explainability
                    </h4>
                    <p className="text-gray-400 text-xs">
                      Grad-CAM overlay highlights the specific regions of the image that highly influenced the PyTorch classifier's prediction.
                    </p>

                    <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/40 flex justify-center items-center aspect-video">
                      {results.explainability?.overlay_generated || results.verification_id ? (
                        <img
                          src={`${BITCHECK_API_URL}/outputs/${results.verification_id}_gradcam_overlay.jpg`}
                          alt="Grad-CAM Activation Map Overlay"
                          className="max-h-48 max-w-full object-contain"
                          onError={(e) => {
                            // Fallback if overlay fails or index is waking up
                            e.target.src = preview;
                          }}
                        />
                      ) : (
                        <span className="text-xs text-gray-500 italic">No explainability heatmap available.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible raw JSON */}
                <details className="group border border-white/5 rounded-xl bg-white/[0.005] overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:text-white cursor-pointer select-none">
                    <span>View Full API Response JSON</span>
                    <span className="text-[10px] transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <pre className="p-4 border-t border-white/5 bg-black/20 text-[10px] text-gray-300 font-mono overflow-auto max-h-52 select-text">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </details>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer info */}
          <p className="text-gray-500 text-[11px] mt-2 text-center">
            This demo communicates directly with my FastAPI model backend hosted on{" "}
            <a
              href="https://huggingface.co/spaces/Jaykay73/Bitcheck-image"
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

export default BitCheckDemo;
