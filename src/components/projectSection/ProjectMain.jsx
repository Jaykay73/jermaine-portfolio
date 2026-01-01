import React, { useState } from "react";
import SectionHeading from "../layout/SectionHeading";
import { projects } from "./sectionData";
import ProjectCard from "./ProjectCard";
import { motion } from "framer-motion";

const ProjectMain = () => {
  return (
    <div className="relative container mx-auto my-12 xl:my-16">
      <motion.div
        className="relative flex flex-col justify-center items-center px-6 xl:px-0 gap-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="flex flex-col w-full xl:mx-[10%] xl:px-[10%] gap-8 mb-8">
          <SectionHeading text="more">
            <span className="text-accent">projects</span>
          </SectionHeading>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-wrap gap-8 "
          >
            {projects
              .filter((project) => ![0, 1, 2, 5].includes(project.id))
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectMain;
