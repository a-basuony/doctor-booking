import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Sidebar: React.FC = ({
  selectedGender,
  setSelectedGender,
}: any) => {
  const [isSortOpen, setIsSortOpen] = useState(true);
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className=" md:block w-50 flex-shrink space-y-8"
    >
      {/* Available Date */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800">Available Date</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-primary-600 accent-primary-600 focus:ring-primary-500 transition-all"
            />
            <span className="text-slate-600 group-hover:text-primary-600 transition-colors">
              Today
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 accent-primary-600 text-primary-600 focus:ring-primary-500 transition-all"
            />
            <span className="text-slate-600 group-hover:text-primary-600 transition-colors">
              Tomorrow
            </span>
          </label>
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800">Gender</h3>
        <div className="flex items-center justify-start  p-1 gap-2">
          {["male", "female"].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-4   capitalize cursor-pointer text-sm rounded-lg font-medium py-1.5  ${
                selectedGender === g
                  ? "bg-primary-600 text-white"
                  : " bg-white border border-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Type */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800">Consultation Type</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 accent-primary-600 text-primary-600 focus:ring-primary-500 transition-all"
              defaultChecked
            />
            <span className="text-slate-600 group-hover:text-primary-600 transition-colors">
              In-clinic
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 accent-primary-600 text-primary-600 focus:ring-primary-500 transition-all"
            />
            <span className="text-slate-600 group-hover:text-primary-600 transition-colors">
              Home Visit
            </span>
          </label>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between"
          onClick={() => setIsSortOpen((prev) => !prev)}
        >
          <h3 className="font-semibold text-slate-800">Sort</h3>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 cursor-pointer
        ${isSortOpen ? "rotate-180" : "rotate-0"}
      `}
          />
        </div>

        <AnimatePresence>
          {isSortOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-2"
            >
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className=" flex items-center justify-center ">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 accent-primary-600 text-primary-600 focus:ring-primary-500 transition-all"
                      // className="peer appearance-none w-5 h-5 border border-primary-600 rounded bg-primary-600 checked:bg-primary-600 checked:border-primary-600"
                      defaultChecked
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-primary-600 transition-colors">
                    Most recommended
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center ">
                    <input
                      type="checkbox"
                      // className="peer appearance-none w-5 h-5 border border-slate-300 rounded bg-white checked:bg-primary-600 checked:border-primary-600 transition-all"
                      className="w-4 h-4 rounded border-slate-300 accent-primary-600 text-primary-600 focus:ring-primary-500 transition-all"
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-primary-600 transition-colors">
                    Price: Low to high
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      // className="peer appearance-none w-5 h-5 border border-slate-300 rounded bg-white checked:bg-primary-600 checked:border-primary-600 transition-all"
                      className="w-4 h-4 rounded border-slate-300 accent-primary-600 text-primary-600 focus:ring-primary-500 transition-all"
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-primary-600 transition-colors">
                    Price: High to low
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
