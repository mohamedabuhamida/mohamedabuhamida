"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CertificateProps } from "@/types";
import { LiaCertificateSolid } from "react-icons/lia";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Certifications({
  certificates,
}: {
  certificates: CertificateProps[];
}) {
  const sortedCertificates = [...certificates].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <div className="w-full py-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedCertificates.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 }
            }}
            className="group relative flex flex-col h-full p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:bg-neutral-900/60 shadow-xl"
          >
            {/* Top Glow Effect on Hover */}
            <div className="absolute inset-x-0 -top-px h-px w-2/3 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-start justify-between mb-6">
              {item.logo_url ? (
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                   <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <img
                    src={item.logo_url}
                    alt={item.organization}
                    className="relative w-14 h-14 object-contain rounded-xl bg-white p-2 shadow-inner"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <LiaCertificateSolid size={32} />
                </div>
              )}
              
              {item.credential_url && (
                <a
                  href={item.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 text-text/40 hover:bg-accent hover:text-bg transition-all duration-300"
                  aria-label="View Credential"
                >
                  <HiOutlineExternalLink size={20} />
                </a>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold leading-tight group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              
              <div className="flex flex-col gap-1">
                <p className="text-accent font-semibold text-sm tracking-wide uppercase">
                  {item.organization}
                </p>
                {item.issue_date && (
                  <p className="text-xs text-text/40 font-mono">
                    Issued {formatDate(item.issue_date)}
                  </p>
                )}
              </div>

              {item.description && (
                <p className="text-sm text-text/50 leading-relaxed line-clamp-3 group-hover:text-text/70 transition-colors">
                  {item.description}
                </p>
              )}
            </div>

            {/* Bottom "Tech" Tag */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-text/20 uppercase tracking-[0.2em]">Verified Credential</span>
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}