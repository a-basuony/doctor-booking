import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// Define sort options type
export type SortOption =
  | "most-recommended"
  | "price-low-high"
  | "price-high-low"
  | null;

interface SidebarProps {
  selectedGender: "male" | "female" | null;
  setSelectedGender: (gender: "male" | "female" | null) => void;
  selectedSort: SortOption;
  setSelectedSort: (sort: SortOption) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({
  selectedGender,
  setSelectedGender,
  selectedSort,
  setSelectedSort,
  isOpen,
  onClose,
}: SidebarProps) => {
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [availableToday, setAvailableToday] = useState(false);
  const [availableTomorrow, setAvailableTomorrow] = useState(false);
  const [inClinic, setInClinic] = useState(true);
  const [homeVisit, setHomeVisit] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSortChange = (sortOption: SortOption) => {
    // Radio button behavior: selecting one deselects others
    setSelectedSort(sortOption);
  };

  const resetAllFilters = () => {
    setSelectedGender(null);
    setSelectedSort(null);
    setAvailableToday(false);
    setAvailableTomorrow(false);
    setInClinic(true);
    setHomeVisit(false);
  };

  const applyFilters = () => {
    if (isMobile) {
      onClose();
    }
  };

  const sidebarContent = (
    <motion.aside
      initial={isMobile ? { x: -100, opacity: 0 } : { x: -20, opacity: 0 }}
      animate={isMobile ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
      exit={isMobile ? { x: -100, opacity: 0 } : { x: -20, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`
        flex-shrink-0 space-y-8 bg-white
        ${
          isMobile
            ? "fixed inset-y-0 left-0 w-80 max-w-full z-50 overflow-y-auto shadow-2xl p-6"
            : "w-64 pr-6"
        }
      `}
      aria-label="Filter options"
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <h2 className="text-xl font-bold text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      )}

      {/* Available Date */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-800">Available Date</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={availableToday}
              onChange={(e) => setAvailableToday(e.target.checked)}
              className="w-4 h-4 rounded accent-primary-500 border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
            />
            <span className="text-slate-600 group-hover:text-primary-600 transition-colors">
              Today
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={availableTomorrow}
              onChange={(e) => setAvailableTomorrow(e.target.checked)}
              className=" accent-primary-500 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
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
        <div className="flex items-center gap-2">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() =>
                setSelectedGender(selectedGender === g ? null : g)
              }
              className={` cursor-pointer
                px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                ${
                  selectedGender === g
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }
              `}
              aria-pressed={selectedGender === g}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
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
              checked={inClinic}
              onChange={(e) => setInClinic(e.target.checked)}
              className="w-4 h-4 accent-primary-500 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
            />
            <span className="text-slate-600 group-hover:text-primary-600 transition-colors">
              In-clinic
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={homeVisit}
              onChange={(e) => setHomeVisit(e.target.checked)}
              className="w-4 h-4  accent-primary-500 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
            />
            <span className="text-slate-600 group-hover:text-primary-600 transition-colors">
              Home Visit
            </span>
          </label>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3 bg-transparent">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className=" bg-transparent cursor-pointer flex items-center justify-between w-full py-2 focus:outline-none "
          aria-expanded={isSortOpen}
        >
          <h3 className="font-semibold text-slate-800">Sort</h3>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300
              ${isSortOpen ? "rotate-180" : ""}
            `}
          />
        </button>

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
                {/* Most Recommended - Radio button */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="sortOption"
                      checked={selectedSort === "most-recommended"}
                      onChange={() => handleSortChange("most-recommended")}
                      className="w-4 h-4 accent-primary-500  border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-primary-600 transition-colors">
                    Most recommended
                  </span>
                </label>

                {/* Price: Low to High - Radio button */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="sortOption"
                      checked={selectedSort === "price-low-high"}
                      onChange={() => handleSortChange("price-low-high")}
                      className="w-4 h-4 accent-primary-500 rounded-full border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-primary-600 transition-colors">
                    Price: Low to high
                  </span>
                </label>

                {/* Price: High to Low - Radio button */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="sortOption"
                      checked={selectedSort === "price-high-low"}
                      onChange={() => handleSortChange("price-high-low")}
                      className="w-4 h-4 accent-primary-500 rounded-full border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all"
                    />
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

      {/* Mobile Footer */}
      {isMobile && (
        <div className="sticky bottom-0 pt-6 mt-8 border-t bg-white">
          <div className="flex gap-3">
            <button
              onClick={resetAllFilters}
              className="cursor-pointer flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Reset All
            </button>
            <button
              onClick={applyFilters}
              className="cursor-pointer flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </motion.aside>
  );

  // For mobile, render as overlay with portal
  if (isMobile && isOpen) {
    return createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
          onClick={handleOverlayClick}
          aria-hidden="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          {/* Sidebar */}
          {sidebarContent}
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }

  // For desktop or mobile when closed
  if (!isMobile || isOpen) {
    return sidebarContent;
  }

  return null;
};
