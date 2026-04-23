import React from "react";
import { motion } from "framer-motion";

const ComingSoonModelCard = ({ title, category, description, color, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-secondary/30 backdrop-blur-sm p-6 h-full opacity-60 cursor-default select-none">
        {/* Coming Soon Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-white/5 border border-white/10 text-gray-400">
            Coming Soon
          </span>
        </div>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 ${color}`}>
          {Icon && <Icon className="text-xl" />}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <span className={`text-[11px] font-bold tracking-wider uppercase ${color} opacity-70`}>
            {category}
          </span>
          <h3 className="text-lg font-bold text-white/50">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Disabled overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default ComingSoonModelCard;
