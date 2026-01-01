import React from "react";
import { motion } from "framer-motion";
import resumeOptimizerImg from "../../assets/projects/resume-optimizer/resume-dashboard.png";
import cineMatchImg from "../../assets/projects/cinematch/cinematch.png";
import mriScanImg from "../../assets/projects/brain-tumor/mri-scan.png";
import legalDocImg from "../../assets/projects/legal-doc/legal-doc.png";
import { FaGithub, FaExternalLinkAlt, FaMicrochip, FaBrain, FaDatabase, FaServer } from "react-icons/fa";

const FeaturedMain = () => {
    const featuredProjects = [
        {
            id: 1,
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
            id: 2,
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
            id: 3,
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
            id: 4,
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
