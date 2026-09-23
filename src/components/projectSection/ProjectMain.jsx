import React from "react";
import SectionHeading from "../layout/SectionHeading";
import { projects } from "./sectionData";
import ProjectCard from "./ProjectCard";
import { motion } from "framer-motion";

const ProjectMain = () => {
  // Exclude the 4 highlighted featured projects (BitCheck: 6, Diabetic: 7, LockedIn: 8, Flappy Bird: 9)
  const moreProjects = projects.filter(
    (project) => ![6, 7, 8, 9].includes(project.id)
  );

  return (
    <div className="relative container mx-auto my-12 xl:my-16 px-6 xl:px-0">
      <motion.div
        className="relative flex flex-col justify-center items-center gap-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="flex flex-col w-full xl:mx-[10%] xl:px-[5%] gap-8 mb-8">
          <SectionHeading text="more">
            <span className="text-accent">projects</span>
          </SectionHeading>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          >
            {moreProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectMain;
