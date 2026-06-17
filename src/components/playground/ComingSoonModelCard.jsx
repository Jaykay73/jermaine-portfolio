import React from "react";
import { motion } from "framer-motion";

const ComingSoonModelCard = ({ title, category, description, color, icon: Icon, liveUrl, image }) => {
  const isLive = !!liveUrl;

  const CardWrapper = isLive ? "a" : "div";
  const wrapperProps = isLive
    ? {
        href: liveUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "relative group block h-full",
      }
    : {
        className: "relative group block h-full",
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <CardWrapper {...wrapperProps}>
        <div
          className={`relative overflow-hidden rounded-xl border border-white/5 bg-secondary/30 backdrop-blur-sm h-full transition-all duration-300 ${
            isLive
              ? "opacity-100 cursor-pointer hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10"
              : "opacity-60 cursor-default select-none"
          }`}
        >
          {/* Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span
              className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
                isLive
                  ? "bg-green-500/10 border-green-500/20 text-green-400 flex items-center gap-1.5"
                  : "bg-white/5 border-white/10 text-gray-400"
              }`}
            >
              {isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
              {isLive ? "Live Space" : "Coming Soon"}
            </span>
          </div>

          {/* Card Image Header */}
          {image && (
            <div className="relative w-full h-36 overflow-hidden border-b border-white/5 bg-black/20">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
            </div>
          )}

          {/* Content Body */}
          <div className={`p-6 flex flex-col gap-2 ${image ? "pt-4" : ""}`}>
            {/* Icon (only show if no image) */}
            {!image && Icon && (
              <div className={`w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 ${color}`}>
                <Icon className="text-xl" />
              </div>
            )}

            <span className={`text-[11px] font-bold tracking-wider uppercase ${color} opacity-70`}>
              {category}
            </span>
            <h3 className={`text-lg font-bold text-white transition-colors duration-300 ${isLive ? "group-hover:text-accent" : "text-white/50"}`}>
              {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Disabled overlay gradient */}
          {!isLive && (
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl pointer-events-none" />
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
};

export default ComingSoonModelCard;
