// Brain Tumor MRI Classifier
import mriScanImg from "../../assets/projects/brain-tumor/mri-scan.png";
import beanTrainingCurves from "../../assets/projects/bean-classification/training-curves.png";
import beanConfusionMatrix from "../../assets/projects/bean-classification/confusion-matrix.png";

// CineMatch API
import cineMatchImg from "../../assets/projects/cinematch/cinematch.png";
import gafferDashboard from "../../assets/projects/fpl-gaffer/gaffer-dashboard.png";

// Legal Doc Analyzer
import legalDocImg from "../../assets/projects/legal-doc/legal-doc.png";

// Bank Churn
import bankChurnImg from "../../assets/projects/bank-churn/churn-dashboard.png";

// Credit Card Fraud
import creditCardFraudImg from "../../assets/projects/credit-card-fraud/fraud-detection.png";

// AI Resume Optimizer
import resumeOptimizerImg from "../../assets/projects/resume-optimizer/resume-dashboard.png";

// New Projects
import bitcheckImg from "../../assets/projects/bitcheck/bitcheck.png";
import diabeticRetinopathyImg from "../../assets/projects/diabetes/diabetic-retinopathy.png";
import lockedInImg from "../../assets/projects/lockedin/lockedin.png";
import flappyBirdRlImg from "../../assets/projects/flappy-bird/flappy-bird.jpg";

const projects = [
  {
    id: 5,
    name: "AI Resume Optimizer",
    category: "AI | Career Tech",
    description:
      "Automated career coach that analyzes skill gaps between resumes and JDs with 95% parsing accuracy. Leverages Gemini 2.0 Flash to generate tailored cover letters and portfolio ideas based on missing skills. Features ONNX quantization for performance and a modern Next.js UI.",
    stack: [
      { name: "Next.js" },
      { name: "FastAPI" },
      { name: "Python" },
      { name: "Google Gemini" },
      { name: "Docker" },
    ],
    links: {
      live: "https://aicareerarchitect.vercel.app",
      github: "https://github.com/Jaykay73/resume-optimizer",
    },
    image: resumeOptimizerImg,
    docImages: [resumeOptimizerImg],
  },
  {
    id: 0,
    name: "Brain Tumor MRI Classifier",
    category: "Deep Learning",
    description:
      "End-to-end deep learning project classifying brain tumor types (Glioma, Meningioma, Pituitary, No Tumor) from MRI scans using Transfer Learning (EfficientNetB0). The model was quantized and deployed on a seamless mobile application for edge inference, and is also available as an interactive Streamlit app.",
    stack: [
      { name: "Python" },
      { name: "TensorFlow" },
      { name: "Streamlit" },
      { name: "EfficientNetB0" },
      { name: "NumPy" },
    ],
    links: {
      live: "https://mri-scan.streamlit.app/",
      github: "https://github.com/Jaykay73/MRI-Scan",
    },
    image: mriScanImg,
    docImages: [mriScanImg, beanTrainingCurves, beanConfusionMatrix],
  },
  {
    id: 1,
    name: "CineMatch API",
    category: "AI | Recommendation System",
    description:
      "Intelligent, content-based movie recommendation engine powered by semantic search (MiniLM-L6-v2) and vector embeddings (FAISS). This system constantly learns and recommends new movies by automatically pulling data from TMDB. Features vibe-based and personalized recommendations via a FastAPI backend.",
    stack: [
      { name: "Python" },
      { name: "FastAPI" },
      { name: "FAISS" },
      { name: "SentenceTransformers" },
      { name: "Pandas" },
    ],
    links: {
      live: "https://aether-match.vercel.app",
      github: "https://github.com/Jaykay73/CineMatch",
    },
    image: cineMatchImg,
    docImages: [cineMatchImg],
  },
  {
    id: 2,
    name: "Legal Document Analyzer",
    category: "NLP | RAG",
    description:
      "Interactive Streamlit app for analyzing contracts. Uses NLP embeddings (SentenceTransformers) to extract clauses and perform semantic search. Features PDF text extraction and cosine similarity ranking.",
    stack: [
      { name: "Python" },
      { name: "Streamlit" },
      { name: "SentenceTransformers" },
      { name: "PyPDF" },
      { name: "Pandas" },
    ],
    links: {
      live: "#",
      github: "https://github.com/Jaykay73/Legal-Document-Analyser",
    },
    image: legalDocImg,
    docImages: [legalDocImg],
  },
  {
    id: 3,
    name: "Bank Customer Churn Prediction",
    category: "Machine Learning | Web App",
    description:
      "A Streamlit web application that predicts whether a bank customer will churn using a trained machine learning model (Gradient Boosting). Features interactive UI, hyperparameter tuning, and feature scaling.",
    stack: [
      { name: "Python" },
      { name: "Streamlit" },
      { name: "Scikit-learn" },
      { name: "Pandas" },
      { name: "Gradient Boosting" },
    ],
    links: {
      live: "https://jaykay-bank-churn.streamlit.app/",
      github: "https://github.com/Jaykay73/Bank-Customer-Churn-Prediction",
    },
    image: bankChurnImg,
    docImages: [bankChurnImg],
  },
  {
    id: 4,
    name: "Credit Card Fraud Detection",
    category: "Machine Learning | Anomaly Detection",
    description:
      "Detects fraudulent transactions using unsupervised anomaly detection (Isolation Forest, Autoencoders) on highly imbalanced data. Features dimensionality reduction (PCA, t-SNE) for visualization.",
    stack: [
      { name: "Python" },
      { name: "TensorFlow" },
      { name: "Scikit-learn" },
      { name: "Pandas" },
      { name: "Matplotlib" },
    ],
    links: {
      live: "#",
      github: "https://github.com/jaykay73/credit-card-fraud-detection",
    },
    image: creditCardFraudImg,
    docImages: [creditCardFraudImg],
  },
  {
    id: 6,
    name: "BitCheck",
    category: "AI | Computer Vision | Cybersecurity",
    description:
      "A multi-signal image verification API that analyzes uploads for manipulation and AI-generation. Combines metadata extraction, C2PA Content Credentials, visible watermark checking (via OCR and template matching), image forensics (sharpness, compression, noise anomalies), a PyTorch EfficientNet classifier trained on 140,000 images (70,000 real and 70,000 AI-generated), and Grad-CAM explainability into a dynamic risk-based JSON report.",
    stack: [
      { name: "FastAPI" },
      { name: "PyTorch" },
      { name: "OpenCV" },
      { name: "Tesseract OCR" },
      { name: "Docker" },
    ],
    links: {
      live: "https://bitcheckapp.vercel.app/",
      github: "https://github.com/Jaykay73/bitcheck",
    },
    image: bitcheckImg,
    docImages: [bitcheckImg],
  },
  {
    id: 7,
    name: "Diabetic Retinopathy Classifier",
    category: "Deep Learning | Medical AI",
    description:
      "A deep learning web application that classifies and detects Diabetic Retinopathy from retina scans using an EfficientNet-B0 PyTorch model trained on medical images. Deployed as an interactive Streamlit demo. Includes Grad-CAM explainability for model interpretability.",
    stack: [
      { name: "PyTorch" },
      { name: "Streamlit" },
      { name: "Python" },
      { name: "EfficientNetB0" },
    ],
    links: {
      live: "https://diabetic-retinopathy-m.streamlit.app/",
      github: "https://github.com/Jaykay73/Diabetes",
    },
    image: diabeticRetinopathyImg,
    docImages: [diabeticRetinopathyImg],
  },
  {
    id: 8,
    name: "LockedIn AI Service",
    category: "AI | Backend Service",
    description:
      "A standalone FastAPI service that generates beginner-friendly learning roadmaps for any skill or topic you want to learn (not just tech skills). It integrates Tavily and YouTube APIs to fetch real resource candidates, applies custom filters to remove invalid/duplicate links, uses DeepSeek LLM for roadmap generation, validates the structure using Pydantic v2, and caches results in SQLite.",
    stack: [
      { name: "FastAPI" },
      { name: "Python" },
      { name: "DeepSeek LLM" },
      { name: "SQLite" },
      { name: "Pydantic" },
      { name: "Tavily API" },
    ],
    links: {
      live: "https://lockedin4l.vercel.app/",
      github: "https://github.com/Jaykay73/LockedIn",
    },
    image: lockedInImg,
    docImages: [lockedInImg],
  },
  {
    id: 9,
    name: "Flappy Bird RL",
    category: "AI | Reinforcement Learning",
    description:
      "A reinforcement learning project exploring policy search and control algorithms to train an agent to play Flappy Bird. Evaluated and compared Q-Learning (with custom discrete state mapping and reward shaping), Deep RL (Proximal Policy Optimization - PPO), neuroevolution (NEAT), and Genetic Algorithms (GA) to analyze sample efficiency, stability, and learning curves.",
    stack: [
      { name: "PyTorch" },
      { name: "Gym/Gymnasium" },
      { name: "NEAT-Python" },
      { name: "NumPy" },
      { name: "Python" },
    ],
    links: {
      live: "#",
      github: "https://github.com/Jaykay73/flappy-bird",
    },
    image: flappyBirdRlImg,
    docImages: [flappyBirdRlImg],
  },
];

export { projects };
