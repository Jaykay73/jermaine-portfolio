export const portfolioKB = [
  {
    id: "profile-overview",
    type: "profile",
    title: "John Aledare Profile",
    text: `
John Aledare, also known as Jermaine or Jaykay, is an AI Engineer and Machine Learning Engineer based in Nigeria.
He builds production-ready AI systems across NLP, computer vision, RAG, FastAPI, and data analytics.
He is a Computer Engineering student at the University of Ilorin.
Contact: aledareoluwaseunjohn@gmail.com
Socials: GitHub (https://github.com/Jaykay73), LinkedIn (https://www.linkedin.com/in/johnaledare), Twitter (https://x.com/Jermaine_73)
`,
    metadata: {
      url: "https://aledare.vercel.app",
      tags: ["profile", "ai engineer", "machine learning", "jermaine", "jaykay", "nigeria"],
    },
  },
  {
    id: "skills-overview",
    type: "skills",
    title: "Technical Skills",
    text: `
John Aledare's technical skills include:
Languages: Python, JavaScript, TypeScript, SQL.
ML Frameworks: PyTorch, TensorFlow, Scikit-learn, ONNX.
NLP: SentenceTransformers, FAISS, RAG Pipelines, Text Classification.
Computer Vision: EfficientNet, Transfer Learning, Image Classification.
Backend: FastAPI, Node.js, Docker.
Frontend: React, Next.js, Streamlit, Tailwind CSS.
Deployment: Hugging Face Spaces, Vercel, Docker, Streamlit Cloud.
Data: Pandas, NumPy, Matplotlib, Feature Engineering.
`,
    metadata: {
      tags: ["skills", "python", "pytorch", "tensorflow", "fastapi", "react", "next.js", "docker", "machine learning"],
    },
  },
  {
    id: "project-nextword",
    type: "project",
    title: "Nigerian Pidgin Next-Word Predictor",
    text: `
John built a Nigerian Pidgin Next-Word Predictor using an LSTM deep learning model and a statistical Trigram model.
It features a custom LSTM model trained on a Pidgin corpus, dual-model architecture for accuracy vs speed tradeoffs, and real-time keystroke debouncing in the UI.
The backend is served with FastAPI and hosted on Hugging Face Spaces.
The project uses PyTorch, FastAPI, Streamlit, Docker, and Hugging Face.
`,
    metadata: {
      liveUrl: "https://nextword-pidgin.streamlit.app/",
      githubUrl: "https://github.com/Jaykay73/nextword-pidgin",
      tags: ["nlp", "pytorch", "fastapi", "hugging face", "streamlit", "docker", "lstm", "trigram", "nigerian pidgin"],
    },
  },
  {
    id: "project-ai-resume",
    type: "project",
    title: "AI Resume Optimizer",
    text: `
John built an AI Resume Optimizer, an automated career coach that analyzes skill gaps between resumes and job descriptions with 95% parsing accuracy.
It uses Gemini 2.0 Flash for tailored cover letter generation, ONNX quantization for performant NER inference, and an end-to-end async pipeline.
Technologies used: Gemini 2.0, ONNX, FastAPI, Next.js, Docker.
`,
    metadata: {
      liveUrl: "https://aicareerarchitect.vercel.app",
      githubUrl: "https://github.com/Jaykay73/resume-optimizer",
      tags: ["ai career tech", "gemini 2.0", "onnx", "fastapi", "next.js", "docker", "resume", "ner"],
    },
  },
  {
    id: "project-cinematch",
    type: "project",
    title: "CineMatch API",
    text: `
John developed the CineMatch API, a content-based movie recommendation engine using semantic search with MiniLM-L6-v2 embeddings and FAISS vector similarity.
It features vibe-based recommendations, an auto-updating movie database pulling from TMDB, and sub-100ms vector search.
Technologies used: FastAPI, FAISS, SentenceTransformers, MiniLM, Pandas.
`,
    metadata: {
      liveUrl: "https://aether-match.vercel.app",
      githubUrl: "https://github.com/Jaykay73/CineMatch",
      tags: ["recommendation system", "faiss", "sentencetransformers", "fastapi", "minilm", "pandas", "semantic search"],
    },
  },
  {
    id: "project-legal-doc",
    type: "project",
    title: "Legal Document Analyzer",
    text: `
John created a RAG-based tool for analyzing legal contracts.
It extracts clauses, identifies obligations and risks using cosine similarity ranking over embedded document chunks.
Features a Retrieval-Augmented Generation architecture and PDF text extraction pipeline.
Technologies used: RAG Pipeline, SentenceTransformers, PyPDF, Streamlit.
`,
    metadata: {
      liveUrl: "#",
      githubUrl: "https://github.com/Jaykay73/Legal-Document-Analyser",
      tags: ["nlp", "rag", "sentencetransformers", "pypdf", "streamlit", "legal documents"],
    },
  },
  {
    id: "project-brain-tumor",
    type: "project",
    title: "Brain Tumor MRI Classifier",
    text: `
John built a deep learning classifier for brain tumor types (Glioma, Meningioma, Pituitary) from MRI scans.
It uses transfer learning with EfficientNetB0, custom data augmentation for medical images, and provides real-time inference with confidence scores via an interactive web app.
The model was optimized via quantization and successfully deployed on a seamless mobile application for efficient edge inference.
Technologies used: TensorFlow, EfficientNet, Transfer Learning, Streamlit, Mobile App, Quantization.
`,
    metadata: {
      liveUrl: "https://mri-scan.streamlit.app/",
      githubUrl: "https://github.com/Jaykay73/MRI-Scan",
      tags: ["medical ai", "computer vision", "tensorflow", "efficientnet", "transfer learning", "streamlit", "mri"],
    },
  },
  {
    id: "project-bank-churn",
    type: "project",
    title: "Bank Customer Churn Prediction",
    text: `
John built an ML web app predicting bank customer churn using Gradient Boosting with interactive feature tuning and visualization.
Technologies used: Scikit-learn, Gradient Boosting, Streamlit, Pandas.
`,
    metadata: {
      tags: ["machine learning", "scikit-learn", "gradient boosting", "streamlit", "pandas", "churn prediction"],
    },
  },
  {
    id: "project-fraud-detect",
    type: "project",
    title: "Credit Card Fraud Detection",
    text: `
An unsupervised anomaly detection system on highly imbalanced transaction data using Isolation Forest and Autoencoders with PCA/t-SNE visualization.
Technologies used: TensorFlow, Scikit-learn, Isolation Forest, Pandas, Autoencoders.
`,
    metadata: {
      tags: ["anomaly detection", "tensorflow", "scikit-learn", "isolation forest", "pandas", "fraud"],
    },
  },
  {
    id: "experience-camlds",
    type: "experience",
    title: "Machine Learning Engineer Intern / Python Tutor",
    text: `
John worked at the Centre for Applied Machine Learning and Data Science (CAMLDS) from Mar 2025 to Dec 2025 as an ML Engineer Intern and Python Tutor.
He built and deployed ML models for NLP and Computer Vision, developed pipelines with Scikit-learn and TensorFlow, deployed models with Streamlit and FastAPI, and mentored interns.
`,
    metadata: {
      company: "CAMLDS",
      period: "Mar 2025 - Dec 2025",
      tags: ["experience", "internship", "python tutor", "camlds", "machine learning"],
    },
  },
  {
    id: "experience-queryfier",
    type: "experience",
    title: "Machine Learning Engineer",
    text: `
John has been working at Queryfier LLC since Jan 2026 as a Machine Learning Engineer.
He is building and deploying ML models for NLP and Computer Vision, developing pipelines with Scikit-learn and TensorFlow, and deploying models with Streamlit and FastAPI.
`,
    metadata: {
      company: "Queryfier LLC",
      period: "Jan 2026 - Present",
      tags: ["experience", "machine learning engineer", "queryfier"],
    },
  },
  {
    id: "blog-accuracy",
    type: "blog",
    title: "Your Model’s Accuracy is Lying to You!",
    text: `
John wrote a blog article explaining why accuracy can be misleading in machine learning, especially when datasets are imbalanced.
`,
    metadata: {
      url: "https://ai.plainenglish.io/your-models-accuracy-is-lying-to-you-e4428283b49d?source=rss-ffa4b39b3261------2",
      platform: "Medium",
      date: "2026-01-14",
      tags: ["machine learning", "metrics", "accuracy", "blog"],
    },
  },
  {
    id: "blog-neural-networks",
    type: "blog",
    title: "How Do Neural Networks Actually Learn?",
    text: `
A beginner-friendly explanation by John detailing how neural networks update weights and learn patterns.
`,
    metadata: {
      url: "https://ai.plainenglish.io/how-do-neural-networks-actually-learn-d9b99e4b47f8?source=rss-ffa4b39b3261------2",
      platform: "Medium",
      date: "2025-10-27",
      tags: ["neural networks", "deep learning", "blog", "beginner"],
    },
  },
  {
    id: "project-bitcheck",
    type: "project",
    title: "BitCheck Image Verification API",
    text: `
John built BitCheck, a multi-signal image verification API that checks uploaded images for manipulation and AI-generation.
It integrates EXIF/XMP/PNG metadata checks, C2PA Content Credentials via c2patool, visible watermark detection (using pytesseract OCR and OpenCV template matching), and lightweight forensics (noise, sharpness, compression anomalies).
It features a custom PyTorch EfficientNet classifier trained on 140,000 images (70,000 real and 70,000 AI-generated) and exposes Grad-CAM explainability maps.
The service is built as a FastAPI backend, containerized with Docker, and deployed on a Hugging Face Space (https://huggingface.co/spaces/Jaykay73/Bitcheck-image).
`,
    metadata: {
      liveUrl: "https://bitcheckapp.vercel.app/",
      githubUrl: "https://github.com/Jaykay73/bitcheck",
      tags: ["image verification", "fastapi", "pytorch", "efficientnet", "c2pa", "opencv", "ocr", "grad-cam", "cybersecurity"],
    },
  },
  {
    id: "project-diabetic-retinopathy",
    type: "project",
    title: "Diabetic Retinopathy Classifier",
    text: `
John built a Diabetic Retinopathy Classifier Streamlit application that detects and classifies diabetic retinopathy from retina scans.
It uses an EfficientNet-B0 deep learning model implemented in PyTorch and trained on medical images.
It features Grad-CAM explainability for model interpretability, showing the high-influence regions of the retina scan.
The project is deployed as an interactive demo on Streamlit Cloud.
`,
    metadata: {
      liveUrl: "https://diabetic-retinopathy-m.streamlit.app/",
      githubUrl: "https://github.com/Jaykay73/Diabetes",
      tags: ["medical ai", "deep learning", "pytorch", "efficientnet", "streamlit", "grad-cam", "diabetic retinopathy"],
    },
  },
  {
    id: "project-lockedin",
    type: "project",
    title: "LockedIn AI Service",
    text: `
John created LockedIn, a standalone FastAPI AI service designed to generate beginner-friendly learning roadmaps for any skill or topic you want to learn (not just tech skills).
It integrates Tavily and YouTube APIs to discover and rank resource candidates, applies custom filtering logic to filter out duplicates, paywalls, or broken links, uses DeepSeek LLM for roadmap generation, validates the structure using Pydantic v2, caches roadmaps in SQLite, and is deployed on a Hugging Face Space (https://huggingface.co/spaces/Jaykay73/LockedIn).
`,
    metadata: {
      liveUrl: "https://lockedin4l.vercel.app/",
      githubUrl: "https://github.com/Jaykay73/LockedIn",
      tags: ["fastapi", "deepseek", "roadmap generator", "tavily", "sqlite", "pydantic", "ai agent"],
    },
  },
  {
    id: "project-flappy-bird-rl",
    type: "project",
    title: "Flappy Bird Reinforcement Learning",
    text: `
John developed Flappy Bird RL, a reinforcement learning project exploring policy search and control algorithms to train agents to play Flappy Bird.
He built and compared multiple approaches: tabular Q-learning with custom discrete state mappings/reward shaping, Proximal Policy Optimization (PPO) using deep neural networks, neuroevolution of augmenting topologies (NEAT), and Genetic Algorithms (GA) to analyze learning curves, stability, and sample efficiency.
`,
    metadata: {
      liveUrl: "#",
      githubUrl: "https://github.com/Jaykay73/flappy-bird",
      tags: ["reinforcement learning", "q-learning", "ppo", "neat", "genetic algorithms", "pytorch", "gymnasium", "numpy"],
    },
  },
];
