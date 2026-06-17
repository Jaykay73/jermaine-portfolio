import React from "react";
import { motion } from "framer-motion";
import resumeOptimizerImg from "../../assets/projects/resume-optimizer/resume-dashboard.png";
import cineMatchImg from "../../assets/projects/cinematch/cinematch.png";
import mriScanImg from "../../assets/projects/brain-tumor/mri-scan.png";
import legalDocImg from "../../assets/projects/legal-doc/legal-doc.png";
import nextwordImg from "../../assets/projects/pidgin-predictor/nextword.jpg";
import bitcheckImg from "../../assets/projects/bitcheck/bitcheck.png";
import diabeticRetinopathyImg from "../../assets/projects/diabetes/diabetic-retinopathy.png";
import lockedInImg from "../../assets/projects/lockedin/lockedin.png";
import flappyBirdRlImg from "../../assets/projects/flappy-bird/flappy-bird.jpg";
import { FaGithub, FaExternalLinkAlt, FaMicrochip, FaBrain, FaDatabase, FaServer } from "react-icons/fa";

const FeaturedMain = () => {
    const featuredProjects = [
        {
            id: 0,
            title: "BitCheck",
            category: "AI | Computer Vision | Cybersecurity",
            subtitle: "Multi-Signal Image Verification & Forensic Analysis",
            description:
                "A sophisticated image verification API designed to identify manipulated and AI-generated media. By aggregating deep learning predictions with traditional forensic filters, C2PA validation, and OCR template matches, it generates comprehensive, risk-weighted reports.",
            techDeepDive:
                "The core pipeline orchestrates multiple verification layers in parallel. It uses **FastAPI** to handle requests asynchronously. Metadata is extracted using **ExifTool / PyPDF**, while Content Credentials are parsed with the **c2patool**. Text/watermarks are identified using **pytesseract OCR** and **OpenCV template matching**. A custom **PyTorch EfficientNet-B0** model (trained on 140,000 images, half real and half AI) generates predictions, combined with CPU-optimized forensic checks (sharpness, noise, and compression anomalies). **Grad-CAM** generates visual heatmaps highlighting high-influence regions for model interpretability.",
            techStack: ["FastAPI", "PyTorch", "OpenCV", "Tesseract OCR", "Grad-CAM", "Docker"],
            image: bitcheckImg,
            links: {
                live: "https://bitcheckapp.vercel.app/",
                github: "https://github.com/Jaykay73/bitcheck",
            },
            color: "text-teal-400",
            borderColor: "border-teal-400/30",
            shadow: "shadow-teal-400/20",
        },
        {
            id: 1,
            title: "Diabetic Retinopathy Classifier",
            category: "Deep Learning | Medical AI",
            subtitle: "Early Diagnostics & Model Explainability",
            description:
                "An advanced computer vision application that detects and classifies Diabetic Retinopathy from retina scans, providing medical professionals with accurate diagnostic assistance and interpretable visual breakdowns.",
            techDeepDive:
                "Utilizes **Transfer Learning** with a fine-tuned **EfficientNet-B0** model built in **PyTorch**. To ensure transparency in medical decisions, the system integrates **Grad-CAM (Gradient-weighted Class Activation Mapping)** to project heatmaps onto the retina scans, highlight abnormal regions (such as microaneurysms or hemorrhages) that influenced the classification, and assist clinical review. The app is deployed on **Streamlit Cloud**.",
            techStack: ["PyTorch", "EfficientNet-B0", "Grad-CAM", "Streamlit", "Python"],
            image: diabeticRetinopathyImg,
            links: {
                live: "https://diabetic-retinopathy-m.streamlit.app/",
                github: "https://github.com/Jaykay73/Diabetes",
            },
            color: "text-pink-400",
            borderColor: "border-pink-400/30",
            shadow: "shadow-pink-400/20",
        },
        {
            id: 2,
            title: "LockedIn AI Service",
            category: "AI | Backend Service",
            subtitle: "Customized Resource Discovery & Roadmap Generator",
            description:
                "A backend service that generates custom, structured, and beginner-friendly learning roadmaps for any topic or skill. It searches the web and YouTube for high-quality tutorials and generates verified roadmaps using generative models.",
            techDeepDive:
                "Built on **FastAPI** and uses **Pydantic v2** for robust schema validation. The engine queries the **Tavily Search API** and **YouTube Data API** to extract resource candidates. Custom filtering logic removes paid, duplicate, or dead links before passing clean data to **DeepSeek LLM** via a custom API prompt. Roadmaps are cached in a **SQLite database** using request hashes to minimize latency and API costs.",
            techStack: ["FastAPI", "DeepSeek LLM", "Tavily API", "YouTube API", "SQLite", "Pydantic"],
            image: lockedInImg,
            links: {
                live: "https://lockedin4l.vercel.app/",
                github: "https://github.com/Jaykay73/LockedIn",
            },
            color: "text-indigo-400",
            borderColor: "border-indigo-400/30",
            shadow: "shadow-indigo-400/20",
        },
        {
            id: 3,
            title: "Flappy Bird RL",
            category: "AI | Reinforcement Learning",
            subtitle: "Multi-Algorithm Policy Search & Control",
            description:
                "A comparative reinforcement learning project mapping the performance, learning stability, and sample efficiency of different agent architectures training to play Flappy Bird.",
            techDeepDive:
                "Explores the spectrum of control algorithms. Built a **tabular Q-learning** agent using custom state discretization and reward shaping. Transitions to deep RL using **Proximal Policy Optimization (PPO)** in **PyTorch** with continuous action/state representations. Also compared neuroevolution via **NEAT-Python** and custom **Genetic Algorithms** to evaluate optimization speed, fitness stability, and the role of observation space engineering.",
            techStack: ["PyTorch", "Gym/Gymnasium", "NEAT-Python", "NumPy", "Q-Learning"],
            image: flappyBirdRlImg,
            links: {
                live: "#",
                github: "https://github.com/Jaykay73/flappy-bird",
            },
            color: "text-orange-400",
            borderColor: "border-orange-400/30",
            shadow: "shadow-orange-400/20",
        },
        {
            id: 4,
            title: "Nigerian Pidgin Next-Word Predictor",
            category: "NLP & Dual-Model Architecture",
            subtitle: "Real-time Text Prediction & Cultural Preservation",
            description:
                "A decoupled microservices system offering real-time next-word suggestions for Nigerian Pidgin. It combines a deep learning LSTM model for context awareness with a statistical Trigram model for speed and efficiency.",
            techDeepDive:
                "The backend uses **FastAPI** to serve both PyTorch LSTM and statistical models. **Docker** ensures consistent deployment on Hugging Face Spaces. The frontend, built with **Streamlit** and custom components, captures keystrokes in real-time, debouncing requests to balance latency and server load.",
            techStack: ["PyTorch", "FastAPI", "Streamlit", "Docker", "Hugging Face"],
            image: nextwordImg,
            links: {
                live: "https://nextword-pidgin.streamlit.app/",
                github: "https://github.com/Jaykay73/nextword-pidgin",
            },
            color: "text-amber-400",
            borderColor: "border-amber-400/30",
            shadow: "shadow-amber-400/20",
        },
        {
            id: 5,
            title: "AI Resume Optimizer",
            category: "AI Career Coach",
            subtitle: "Job Matching & tailored Cover letters",
            description:
                "An intelligent career assistant that bridges the gap between candidates and their dream roles. This system parses resumes with 95% accuracy and compares them against job descriptions to identify critical skill gaps.",
            techDeepDive:
                "The core is powered by **Gemini 2.0 Flash**, enabling high-context generation for tailored cover letters. Performance is optimized using **ONNX quantization** for local Named Entity Recognition (NER), drastically reducing inference time. The backend utilizes **FastAPI's asynchronous capabilities** to handle concurrent requests efficiently.",
            techStack: ["Gemini 2.0", "ONNX", "FastAPI", "Next.js", "Docker"],
            image: resumeOptimizerImg,
            links: {
                live: "https://aicareerarchitect.vercel.app",
                github: "https://github.com/Jaykay73/resume-optimizer",
            },
            color: "text-cyan-400",
            borderColor: "border-cyan-400/30",
            shadow: "shadow-cyan-400/20",
        },
        {
            id: 6,
            title: "CineMatch API",
            category: "Recommendation Engine",
            subtitle: "Semantic Search & Vector Embeddings",
            description:
                "A next-generation movie recommendation engine that moves beyond simple genre matching. CineMatch understands the 'vibe' of a movie through deep semantic analysis.",
            techDeepDive:
                "Utilizes **MiniLM-L6-v2** to generate dense vector embeddings for movie plots. **FAISS (Facebook AI Similarity Search)** performs high-speed similarity searches across the vector space. The system implements a **self-updating pipeline** that fetches new releases from TMDB, ensuring recommendations stay current.",
            techStack: ["FAISS", "SentenceTransformers", "FastAPI", "MiniLM", "Pandas"],
            image: cineMatchImg,
            links: {
                live: "https://aether-match.vercel.app",
                github: "https://github.com/Jaykay73/CineMatch",
            },
            color: "text-purple-400",
            borderColor: "border-purple-400/30",
            shadow: "shadow-purple-400/20",
        },
        {
            id: 7,
            title: "Legal Document Analyzer",
            category: "NLP & RAG System",
            subtitle: "Automated Contract Analysis",
            description:
                "A specialized tool designed to demystify complex legal language. It allows users to upload contracts and instantly extract critical clauses, obligations, and potential risks.",
            techDeepDive:
                "Built on a **RAG (Retrieval-Augmented Generation)** architecture. Text is extracted from PDFs and chunked for embedding. **Cosine Similarity rankings** retrieve the most relevant context for every user query, allowing the LLM to provide precise, fact-based answers rooted strictly in the document text.",
            techStack: ["RAG Pipeline", "NLP", "PyPDF", "Vector Search", "Streamlit"],
            image: legalDocImg,
            links: {
                live: "#",
                github: "https://github.com/Jaykay73/Legal-Document-Analyser",
            },
            color: "text-emerald-400",
            borderColor: "border-emerald-400/30",
            shadow: "shadow-emerald-400/20",
        },
        {
            id: 8,
            title: "Brain Tumor MRI Classifier",
            category: "Medical AI Diagnostics",
            subtitle: "Computer Vision & Deep Learning",
            description:
                "A life-saving diagnostic aid that classifies brain tumors (Glioma, Meningioma, Pituitary) from MRI scans with high precision, aiding medical professionals in early detection.",
            techDeepDive:
                "Leverages **Transfer Learning** with the **EfficientNetB0** architecture, fine-tuned on thousands of MRI images. The model features custom **data augmentation layers** to handle scan variations. Deployed with a user-friendly interface that provides real-time inference and confidence scores.",
            techStack: ["TensorFlow", "EfficientNet", "Transfer Learning", "Computer Vision"],
            image: mriScanImg,
            links: {
                live: "https://mri-scan.streamlit.app/",
                github: "https://github.com/Jaykay73/MRI-Scan",
            },
            color: "text-rose-400",
            borderColor: "border-rose-400/30",
            shadow: "shadow-rose-400/20",
        },
    ];

    return (
        <div className="pt-20 pb-16 container mx-auto px-6 relative z-10" id="featured">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 text-center mb-20"
            >
                <span className="text-accent text-sm tracking-widest uppercase font-semibold">
                    Curated Work
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Featured <span className="text-accent">Projects</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mt-4">
                    A deep dive into my most complex technical challenges, featuring advanced implementations of AI, RAG pipelines, and quantization.
                </p>
            </motion.div>

            <div className="flex flex-col gap-24">
                {featuredProjects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                            } items-center gap-12 lg:gap-20`}
                    >
                        {/* Image Section */}
                        <div className="w-full lg:w-1/2 group relative">
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${index % 2 === 0 ? "from-secondary/50 to-transparent" : "from-transparent to-secondary/50"
                                    } z-10 rounded-xl`}
                            />
                            <div className={`absolute -inset-2 rounded-xl blur-xl opacity-20 bg-gradient-to-r from-accent to-purple-600 group-hover:opacity-40 transition-opacity duration-500`}></div>
                            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <span className={`text-sm font-bold tracking-wider uppercase ${project.color}`}>
                                    {project.category}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-bold text-white">
                                    {project.title}
                                </h3>
                            </div>

                            <div className="bg-secondary/40 backdrop-blur-sm border border-white/5 p-6 rounded-xl relative">
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                    <FaMicrochip className={project.color} /> Technical Deep Dive
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {project.techDeepDive.split("**").map((part, i) =>
                                        i % 2 === 1 ? <span key={i} className="text-white font-medium">{part}</span> : part
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 my-4">
                                {project.techStack.map((tech, i) => (
                                    <span
                                        key={i}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-accent/50 transition-colors`}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-6 mt-2">
                                {project.links.github !== "#" && (
                                    <a
                                        href={project.links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-white hover:text-accent transition-colors group"
                                    >
                                        <FaGithub className="text-xl group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">View Code</span>
                                    </a>
                                )}
                                {project.links.live !== "#" && (
                                    <a
                                        href={project.links.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-white hover:text-accent transition-colors group"
                                    >
                                        <FaExternalLinkAlt className="text-lg group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Live Demo</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedMain;
