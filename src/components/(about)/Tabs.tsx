"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TbTopologyStar3 } from "react-icons/tb";
import { MdWorkHistory } from "react-icons/md";
import { FaGraduationCap, FaTrophy } from "react-icons/fa";
import { LiaCertificateSolid } from "react-icons/lia";

export const aboutTabs = [
  { key: "skills", label: "Skills", icon: TbTopologyStar3 },
  { key: "experience", label: "Experience", icon: MdWorkHistory },
  { key: "education", label: "Education", icon: FaGraduationCap },
  { key: "achievements", label: "Achievements", icon: FaTrophy },
  { key: "certificates", label: "Certificates", icon: LiaCertificateSolid },
];

export default function Tabs({
  visable,
  setVisable,
}: {
  visable: string;
  setVisable: (value: string) => void;
}) {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  return (
    <>
      <div className="flex  text-left gap-4">
        {aboutTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = visable === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setVisable(tab.key)}
              onMouseEnter={(e) => {
                setTooltip({
                  visible: true,
                  x: e.clientX,
                  y: e.clientY,
                  text: tab.label,
                });
              }}
              onMouseMove={(e) =>
                setTooltip((prev) => ({
                  ...prev,
                  x: e.clientX,
                  y: e.clientY,
                }))
              }
              onMouseLeave={() => {
                setTooltip((prev) => ({ ...prev, visible: false }));
              }}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 cursor-pointer 
              ${
                isActive
                  ? "bg-accent/10 border border-accent shadow-[0_0_15px_rgba(78,168,222,0.4)]"
                  : "border border-border hover:bg-primary/20"
              }`}
            >
              <Icon
                className={`text-xl transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-text"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          style={{
            top: tooltip.y + 12,
            left: tooltip.x + 12,
            position: "fixed",
            pointerEvents: "none",
          }}
          className="bg-primary/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 shadow-xl z-50"
        >
          {tooltip.text}
        </motion.div>
      )}
    </>
  );
}
