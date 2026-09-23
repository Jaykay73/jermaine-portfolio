import React from "react";
import { motion } from "framer-motion";

const data = [
  {
    period: "Jan 2026 - Present",
    role: "Machine Learning Engineer",
    company: "Queryfier LLC",
    description:
      "Build and deploy production-grade machine learning models for NLP and Computer Vision tasks. Construct end-to-end data preparation and training pipelines using Scikit-learn, TensorFlow, and PyTorch, deploying endpoints via FastAPI and Streamlit.",
    locationType: "Remote",
  },
  {
    period: "Mar 2025 - Dec 2025",
    role: "ML Engineer & Tutor",
    company: "Centre for Applied Machine Learning and Data Science",
    description:
      "Built and deployed ML models for NLP and Computer Vision. Developed pipelines with Scikit-learn and TensorFlow. Deployed models with Streamlit and FastAPI. Mentored interns.",
    locationType: "On-site",
  },
];

const ExperienceContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="flex flex-col gap-8 text-center justify-center items-center"
    >
      {/* <p
        className="uppercase text-gray-400 leading-relaxed text-sm tracking-wide
      max-w-[500px] xl:max-w-[800px]"
      >
        Explore my career path, featuring key roles and impactful contributions
        across diverse organizations. Discover how each experience has shaped my
        professional growth and expertise. */}
      {/* </p> */}

      {/* Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start w-full">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative bg-secondary/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-md hover:shadow-accent/40 transition-all duration-300 w-full flex flex-col justify-between"
          >
            <div>
              <p className="text-accent text-sm font-semibold mb-2">{item.period}</p>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
                {item.role}
              </h3>
              <p className="text-primary/80 text-sm md:text-base leading-relaxed mb-6">{item.description}</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-primary font-medium">
                <span className="text-accent text-lg">●</span>
                <span className="font-semibold text-sm md:text-base">{item.company}</span>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full border border-accent/40 text-accent bg-accent/10">
                {item.locationType}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExperienceContent;
