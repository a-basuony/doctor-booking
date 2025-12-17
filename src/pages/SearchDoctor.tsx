import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Sidebar } from "../components/SearchDoctors/Sidebar";
import { DoctorCard } from "../components/SearchDoctors/DoctorCard";
import { DOCTORS, SPECIALTIES, ICON_MAP } from "../constants/constants";
import mapImg from "../assets/map.png";
import filterImg from "../assets/filter.png";

// Types
type Gender = "male" | "female" | null;

// Constants
const PAGE_SIZE = 9;

const SearchDoctor = () => {
  // State
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("1");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender>("male");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Filter doctors based on search query, specialty, and gender
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "1" || doctor.specialtyId === selectedSpecialty;
      const matchesGender = !selectedGender || doctor.gender === selectedGender;

      return matchesSearch && matchesSpecialty && matchesGender;
    });
  }, [searchQuery, selectedSpecialty, selectedGender]);

  // Paginate filtered doctors
  const paginatedDoctors = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredDoctors.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredDoctors, page]);

  const totalPages = Math.ceil(filteredDoctors.length / PAGE_SIZE);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Handlers
  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const handlePreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  const handleSpecialtySelect = useCallback((id: string) => {
    setSelectedSpecialty(id);
    setPage(1); // Reset to first page when changing filters
  }, []);

  const handleGenderSelect = useCallback((gender: Gender) => {
    setSelectedGender(gender);
    setPage(1); // Reset to first page when changing filters
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setPage(1); // Reset to first page when searching
    },
    []
  );

  // Render methods
  const renderSpecialties = () => (
    <div className="relative group">
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
        {SPECIALTIES.map((spec, index) => {
          const Icon = ICON_MAP[spec.icon];
          const isSelected = selectedSpecialty === spec.id;

          return (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              key={spec.id}
              onClick={() => handleSpecialtySelect(spec.id)}
              aria-pressed={isSelected}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl border whitespace-nowrap transition-all duration-300
                cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${
                  isSelected
                    ? "bg-slate-50 border-primary-200 shadow-sm text-slate-900"
                    : "bg-white border-slate-200 hover:border-primary-200 hover:shadow-sm text-slate-500"
                }
              `}
            >
              <span
                className={isSelected ? "text-primary-600" : "text-slate-400"}
              >
                {Icon && <Icon className="w-5 h-5" />}
              </span>
              <span className="font-medium">{spec.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const renderPagination = () => (
    <div
      className={`flex items-center gap-4 ${
        page === 1 ? "justify-center" : "justify-between"
      }`}
    >
      {hasPreviousPage && (
        <button
          onClick={handlePreviousPage}
          className="px-6 py-2.5 w-[247px] h-[52px] cursor-pointer border rounded-lg font-semibold transition-colors bg-transparent border-primary-500 text-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Go to previous page"
        >
          Previous page
        </button>
      )}

      <button
        onClick={handleNextPage}
        disabled={!hasNextPage}
        className={`
          px-6 py-2.5 w-[247px] h-[52px] cursor-pointer border rounded-lg font-semibold transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${
            !hasNextPage
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-transparent border-primary-500 text-primary-500 hover:bg-primary-50"
          }
        `}
        aria-label="Go to next page"
        aria-disabled={!hasNextPage}
      >
        Next Page
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Navigation Bar */}

      {/* Top Navigation Bar */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8"
      >
        {/* Container for sm and above screens */}
        <div className="hidden sm:flex items-stretch gap-3 md:gap-4 lg:gap-6">
          {/* Filter Button - First */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center md:justify-start gap-2 px-4 py-3 text-slate-600 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-primary-300 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 min-w-[90px] md:w-[9rem]"
            aria-label={showFilters ? "Hide filters" : "Show filters"}
            aria-expanded={showFilters}
          >
            <img
              src={filterImg}
              alt="Filter"
              className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
            />
            <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
              Filter
            </span>
            <span className="sr-only md:not-sr-only ml-1">
              {showFilters ? (
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </span>
            <span className="md:hidden text-sm font-medium">Filter</span>
          </button>

          {/* Search Input - Second */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search doctors by name or specialty"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-11 md:pl-12 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all shadow-sm text-sm md:text-base"
              aria-label="Search doctors"
            />
            <svg
              className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Map Button - Third */}
          <Link
            to="/map"
            className="flex items-center justify-center md:justify-start gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium no-underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 min-w-[90px] md:w-[9rem]"
            aria-label="View doctors on map"
          >
            <img
              src={mapImg}
              alt="Map"
              className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
            />
            <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
              Map
            </span>
            <span className="md:hidden text-sm font-medium">Map</span>
          </Link>
        </div>

        {/* Mobile Layout (below sm breakpoint) */}
        <div className="sm:hidden space-y-3">
          {/* Mobile Search - Top priority on mobile */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-11 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all shadow-sm"
              aria-label="Search doctors"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                showFilters
                  ? "bg-primary-50 border-primary-200 text-primary-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              aria-label={showFilters ? "Hide filters" : "Show filters"}
            >
              <img src={filterImg} alt="" className="w-5 h-5" />
              <span className="text-sm font-medium">
                {showFilters ? "Hide Filters" : "Filters"}
              </span>
            </button>

            <Link
              to="/map"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium no-underline"
              aria-label="View doctors on map"
            >
              <img src={mapImg} alt="" className="w-5 h-5" />
              <span className="text-sm font-medium">Map</span>
            </Link>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 sm:mt-4 flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 text-primary-600">
              <div className="w-2 h-2 rounded-full bg-primary-600" />
              <span className="font-medium">Filters active</span>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="text-slate-500 hover:text-slate-700 px-2 py-1 rounded transition-colors text-sm"
            >
              {window.innerWidth >= 640 ? "Hide filters" : "Close"}
            </button>
          </motion.div>
        )}
      </motion.div>
      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-8 flex items-start gap-8">
        {/* Sidebar Filters */}
        {showFilters && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-64 flex-shrink-0 space-y-8 pr-6"
            aria-label="Filter options"
          >
            {showFilters && (
              <Sidebar
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </motion.aside>
        )}

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Specialties Section */}
          <section className="mb-8" aria-label="Specialties">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
              Choose Specialties
            </h2>
            {renderSpecialties()}
          </section>

          {/* Results Info */}
          <div className="mb-6 text-slate-600">
            <p>
              Showing {paginatedDoctors.length} of {filteredDoctors.length}{" "}
              doctors
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Doctors Grid */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
            aria-label="Doctors list"
          >
            {paginatedDoctors.length > 0 ? (
              paginatedDoctors.map((doctor, idx) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg mb-4">
                  No doctors found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecialty("1");
                    setSelectedGender(null);
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.section>

          {/* Pagination */}
          {paginatedDoctors.length > 0 && (
            <nav aria-label="Pagination">
              {renderPagination()}
              <div className="mt-4 text-center text-slate-500 text-sm">
                Page {page} of {totalPages}
              </div>
            </nav>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchDoctor;
