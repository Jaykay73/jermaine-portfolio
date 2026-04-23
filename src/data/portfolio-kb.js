/**
 * Portfolio Knowledge Base — Placeholder for future RAG implementation.
 *
 * This structured data can be chunked and embedded for retrieval-augmented
 * generation. For now it serves as a single source of truth about John's
 * portfolio that the chatbot system prompt references.
 *
 * Future plan:
 * 1. Convert entries to embeddings (e.g., via SentenceTransformers or OpenAI)
 * 2. Store in a vector DB (FAISS, Pinecone, Chroma, etc.)
 * 3. Retrieve top-k relevant chunks before sending to the LLM
 */

const portfolioKnowledgeBase = {
  personal: {
    name: "John Aledare",
    aliases: ["Jermaine", "Jaykay"],
    title: "AI Engineer & Machine Learning Engineer",
    location: "Nigeria",
    email: "aledareoluwaseunjohn@gmail.com",
    socials: {
      github: "https://github.com/Jaykay73",
      linkedin: "https://www.linkedin.com/in/johnaledare",
      twitter: "https://x.com/Jermaine_73",
    },
  },

  skills: {
    languages: ["Python", "JavaScript", "TypeScript", "SQL"],
    mlFrameworks: ["PyTorch", "TensorFlow", "Scikit-learn", "ONNX"],
    nlp: ["SentenceTransformers", "FAISS", "RAG Pipelines", "Text Classification"],
    computerVision: ["EfficientNet", "Transfer Learning", "Image Classification"],
    backend: ["FastAPI", "Node.js", "Docker"],
    frontend: ["React", "Next.js", "Streamlit", "Tailwind CSS"],
    deployment: ["Hugging Face Spaces", "Vercel", "Docker", "Streamlit Cloud"],
    data: ["Pandas", "NumPy", "Matplotlib", "Feature Engineering"],
  },

  projects: [
    {
      name: "Nigerian Pidgin Next-Word Predictor",
      category: "NLP",
      description:
        "Dual-model next-word prediction system for Nigerian Pidgin using LSTM deep learning and statistical Trigram models. Deployed as a FastAPI microservice on Hugging Face Spaces.",
      techStack: ["PyTorch", "FastAPI", "Streamlit", "Docker", "Hugging Face"],
      highlights: [
        "Custom LSTM model trained on Pidgin corpus",
        "Dual-model architecture for accuracy vs speed tradeoffs",
        "Real-time keystroke debouncing in the UI",
      ],
    },
    {
      name: "AI Resume Optimizer",
      category: "AI Career Tech",
      description:
        "Automated career coach that analyzes skill gaps between resumes and job descriptions with 95% parsing accuracy. Uses Gemini 2.0 Flash for tailored cover letter generation.",
      techStack: ["Gemini 2.0", "ONNX", "FastAPI", "Next.js", "Docker"],
      highlights: [
        "ONNX quantization for performant NER inference",
        "95% resume parsing accuracy",
        "End-to-end async pipeline",
      ],
    },
    {
      name: "CineMatch API",
      category: "Recommendation System",
      description:
        "Content-based movie recommendation engine using semantic search with MiniLM-L6-v2 embeddings and FAISS vector similarity. Self-updating pipeline pulls new releases from TMDB.",
      techStack: ["FAISS", "SentenceTransformers", "FastAPI", "MiniLM", "Pandas"],
      highlights: [
        "Vibe-based recommendations via dense embeddings",
        "Auto-updating movie database",
        "Sub-100ms vector search",
      ],
    },
    {
      name: "Legal Document Analyzer",
      category: "NLP / RAG",
      description:
        "RAG-based tool for analyzing legal contracts. Extracts clauses, identifies obligations and risks using cosine similarity ranking over embedded document chunks.",
      techStack: ["RAG Pipeline", "SentenceTransformers", "PyPDF", "Streamlit"],
      highlights: [
        "Retrieval-Augmented Generation architecture",
        "Cosine similarity for precision ranking",
        "PDF text extraction pipeline",
      ],
    },
    {
      name: "Brain Tumor MRI Classifier",
      category: "Medical AI / Computer Vision",
      description:
        "Deep learning classifier for brain tumor types (Glioma, Meningioma, Pituitary) from MRI scans. Transfer learning with EfficientNetB0.",
      techStack: ["TensorFlow", "EfficientNet", "Transfer Learning", "Streamlit"],
      highlights: [
        "Custom data augmentation for medical images",
        "Real-time inference with confidence scores",
        "Deployed as interactive web app",
      ],
    },
    {
      name: "Bank Customer Churn Prediction",
      category: "Machine Learning",
      description:
        "ML web app predicting bank customer churn using Gradient Boosting with interactive feature tuning and visualization.",
      techStack: ["Scikit-learn", "Gradient Boosting", "Streamlit", "Pandas"],
    },
    {
      name: "Credit Card Fraud Detection",
      category: "Anomaly Detection",
      description:
        "Unsupervised anomaly detection on highly imbalanced transaction data using Isolation Forest and Autoencoders with PCA/t-SNE visualization.",
      techStack: ["TensorFlow", "Scikit-learn", "Isolation Forest", "Pandas"],
    },
  ],

  experience: [
    // Add work experience entries here when ready
    // { company: "", role: "", period: "", highlights: [] }
  ],

  blogTopics: [
    "Building production ML pipelines",
    "NLP for low-resource African languages",
    "Vector search and semantic matching",
    "ONNX model optimization",
    "RAG architecture patterns",
  ],
};

export default portfolioKnowledgeBase;
