import React from "react";
import SectionHeading from "../layout/SectionHeading";
import MyTools from "./MyTools";
import { motion } from "framer-motion";

const AboutMain = () => {
  return (
    <div className="relative container mx-auto my-12 xl:my-16 overflow-hidden">
      <motion.div
        className="relative flex flex-col items-center justify-center px-6 xl:px-0 gap-8"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col w-full xl:mx-[10%] xl:px-[10%] gap-8 mb-8">
          <SectionHeading text="about">
            <span className="text-accent">me</span>
          </SectionHeading>
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <p className="text-sm xl:text-lg text-primary/80 leading-relaxed">
              I am a Machine Learning Engineer and Data Scientist whose journey into AI was sparked by a deep fascination with problem-solving algorithms.
              <br /> <br />
              These days, pretty much anyone can write code, and LLMs can generate it in seconds. But writing code is only a small part of the job. For me, what really matters is systematic problem solving. Before I write a single line, I like to step back: break the problem down into simple pieces, spot where things might break, and figure out what makes the most sense to build. I care less about flashy syntax and much more about building things that actually work in the real world.
              <br /> <br />
              Specializing in Python, computer vision, NLP, and backend AI services, I focus on building reliable, practical solutions that turn complex data into measurable value. When I'm not building, I write articles on my blog to explain complex AI topics as simply as possible and help other developers work through their own engineering hurdles.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <p className="font-bold text-accent">
              // Tools I enjoy working with:
            </p>
            <div className="flex flex-col">
              <div>
                <MyTools />
              </div>
              <div className="hidden md:block">
                <MyTools animateInverse={true} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutMain;
