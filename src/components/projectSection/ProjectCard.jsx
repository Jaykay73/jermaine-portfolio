import React from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ProjectCard = ({ project }) => {
  const hasLiveLink = project.links && project.links.live && project.links.live !== "#";
  const hasGithub = project.links && project.links.github && project.links.github !== "#";

  return (
    <motion.div
      className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl bg-secondary/40 backdrop-blur-md border border-white/10 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 w-full group"
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="flex flex-col gap-5">
        <div className="relative flex justify-center items-center bg-accent/10 rounded-2xl shadow-md h-[190px] overflow-hidden border border-white/5">
          <img
            src={project.image}
            alt={project.name}
            className="object-cover object-center w-full h-full rounded-2xl group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          {project.category && (
            <span className="text-accent text-xs font-bold uppercase tracking-wider">
              {project.category}
            </span>
          )}
          <h3 className="font-bold leading-snug text-xl text-primary group-hover:text-accent transition-colors duration-300">
            {project.name}
          </h3>
        </div>

        <p className="text-primary/80 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <ul className="flex gap-2 flex-wrap">
          {project.stack &&
            project.stack.map((item, index) => (
              <li
                key={index}
                className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300"
              >
                {item.name}
              </li>
            ))}
        </ul>
      </div>

      <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hasLiveLink ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent/15 text-accent text-sm font-semibold rounded-xl hover:bg-accent hover:text-background transition-all duration-300"
            >
              <span>Live Demo</span>
              <FaExternalLinkAlt className="text-xs" />
            </a>
          ) : (
            <span className="text-xs text-gray-400 italic">Live demo upon request</span>
          )}
        </div>

        {hasGithub && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="flex justify-center items-center w-10 h-10 bg-white/5 rounded-full hover:bg-white/15 hover:scale-110 transition-all duration-300 text-gray-300 hover:text-white"
          >
            <FaGithub className="text-xl" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
