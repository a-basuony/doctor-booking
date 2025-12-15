import React from "react";
import { motion } from "framer-motion";

export const DoctorCardSkeleton: React.FC = () => {
  return (
    <motion.div
      className="
        bg-white rounded-xl p-4
        border border-slate-100
        shadow-sm
        flex flex-col justify-between
        animate-pulse
      "
    >
      {/* Top section */}
      <div className="flex gap-4 mb-4">
        {/* Image */}
        <div className="w-20 h-20 rounded-lg bg-slate-200 flex-shrink-0" />

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-full bg-slate-200 rounded" />
          <div className="flex gap-4 mt-3">
            <div className="h-3 w-12 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-auto space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>

        <div className="h-10 w-full bg-slate-200 rounded-lg" />
      </div>
    </motion.div>
  );
};
