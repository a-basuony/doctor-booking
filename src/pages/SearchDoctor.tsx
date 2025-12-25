import type { SortOption } from "../components/SearchDoctors/Sidebar";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Sidebar } from "../components/SearchDoctors/Sidebar";
import { DoctorCard } from "../components/SearchDoctors/DoctorCard";
import mapImg from "../assets/map.png";
import filterImg from "../assets/filter.png";
import { SPECIALTIES, ICON_MAP } from "../constants/constants";
import type { Doctor } from "../constants/constants";
import { api } from "../services/api";
// import { api } from "../api/axios";

// Update Gender type to match what your Sidebar expects
type Gender = "male" | "female" | null;

const PAGE_SIZE = 9;

// Interface for API response
interface ApiDoctor {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  profile_photo: string | null;
  specialty: {
    id: number;
    name: string;
    image: string;
  };
  license_number: string;
  bio: string | null;
  session_price: number;
  clinic_address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  experience_years: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiDoctor[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Fallback data for when API fields are missing
const FALLBACK_DOCTORS: Doctor[] = [
  {
    id: "fallback-1",
    name: "Dr. Unavailable",
    specialty: "General Practitioner",
    hospital: "Medical Center",
    rating: 4.5,
    timeStart: "9:00am",
    timeEnd: "5:00pm",
    price: 200,
    image: "https://picsum.photos/id/100/200/200",
    gender: "male",
  },
  {
    id: "fallback-2",
    name: "Dr. Not Available",
    specialty: "General Practitioner",
    hospital: "Healthcare Clinic",
    rating: 4.3,
    timeStart: "10:00am",
    timeEnd: "6:00pm",
    price: 180,
    image: "https://picsum.photos/id/101/200/200",
    gender: "female",
  },
];

const SearchDoctor = () => {
  // State
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("1");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<ApiResponse>("/doctors");

        if (response.data.success && response.data.data) {
          // Map API data to match Doctor interface
          const mappedDoctors = response.data.data.map(
            (apiDoctor: ApiDoctor): Doctor => {
              // Extract gender from name (fallback logic)
              const firstName =
                apiDoctor.name.split(" ")[0]?.toLowerCase() || "";
              let gender: "male" | "female" = "male";
              if (
                firstName.includes("sarah") ||
                firstName.includes("emily") ||
                firstName.includes("linda") ||
                firstName.includes("jennifer") ||
                firstName.includes("olivia") ||
                firstName.includes("sophia") ||
                firstName.includes("ava") ||
                firstName.includes("mia") ||
                firstName.includes("charlotte") ||
                firstName.includes("natalie") ||
                firstName.includes("isabella")
              ) {
                gender = "female";
              } else if (
                firstName.includes("zeinab") ||
                firstName.includes("ahmed")
              ) {
                // Based on your API data
                gender = firstName.includes("zeinab") ? "female" : "male";
              }

              // Use specialty from API or fallback
              const specialtyName =
                apiDoctor.specialty?.name || "General Practitioner";

              // Generate a hospital name based on clinic address
              const hospital = apiDoctor.clinic_address
                ? `${
                    apiDoctor.clinic_address.split(",")[0] || "Medical"
                  } Center`
                : "Healthcare Clinic";

              // Generate rating based on experience years
              const baseRating = 4.0;
              const experienceBonus = Math.min(
                apiDoctor.experience_years / 10,
                1.0
              );
              const rating = parseFloat(
                (baseRating + experienceBonus).toFixed(1)
              );

              // Generate working hours based on ID (for variety)
              const timeStart = apiDoctor.id % 2 === 0 ? "9:00am" : "8:30am";
              const timeEnd = apiDoctor.id % 3 === 0 ? "5:00pm" : "6:00pm";

              // Use profile photo if available, otherwise fallback image based on gender
              const image = apiDoctor.profile_photo
                ? `https://round8-backend-team-one.huma-volve.com/storage/${apiDoctor.profile_photo}`
                : `https://picsum.photos/id/${
                    100 + (apiDoctor.id % 50)
                  }/200/200`;

              return {
                id: apiDoctor.id.toString(),
                name: apiDoctor.name || "Dr. Unavailable",
                specialty: specialtyName,
                hospital: hospital,
                rating: rating,
                timeStart: timeStart,
                timeEnd: timeEnd,
                price: apiDoctor.session_price || 200,
                image: image,
                gender: gender,
              };
            }
          );

          setDoctors(mappedDoctors);
        } else {
          setError("Failed to load doctors data");
          setDoctors(FALLBACK_DOCTORS);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Unable to load doctors. Please try again later.");
        setDoctors(FALLBACK_DOCTORS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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

  // Update the filteredDoctors useMemo to include sorting
  const filteredDoctors = useMemo(() => {
    let result = doctors.filter((doctor: Doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      // Find the selected specialty object
      const selectedSpecialtyObj = SPECIALTIES.find(
        (s) => s.id === selectedSpecialty
      );

      // If "1" means "All" or first item in specialties
      const matchesSpecialty =
        selectedSpecialty === "1" ||
        (selectedSpecialtyObj &&
          doctor.specialty.toLowerCase() ===
            selectedSpecialtyObj.name.toLowerCase());

      // Filter by gender
      const matchesGender = !selectedGender || doctor.gender === selectedGender;

      return matchesSearch && matchesSpecialty && matchesGender;
    });

    // Apply sorting based on selectedSort
    if (selectedSort) {
      result = [...result].sort((a, b) => {
        switch (selectedSort) {
          case "most-recommended":
            // Sort by rating (highest first), then experience (if available)
            if (b.rating !== a.rating) {
              return b.rating - a.rating;
            }
            // If ratings are equal, sort by price (lower first for better value)
            return a.price - b.price;

          case "price-low-high":
            // Sort by price ascending
            return a.price - b.price;

          case "price-high-low":
            // Sort by price descending
            return b.price - a.price;

          default:
            return 0;
        }
      });
    }

    return result;
  }, [doctors, searchQuery, selectedSpecialty, selectedGender, selectedSort]);

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
    setSelectedSpecialty((prev) => (prev === id ? "1" : id));
    setPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setPage(1);
    },
    []
  );

  // Update clearAllFilters to also clear sort
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSpecialty("1");
    setSelectedGender(null);
    setSelectedSort(null);
    setPage(1);
  }, []);

  // Skeleton loader component
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
      {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl p-4 shadow-sm border flex flex-col animate-pulse"
        >
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="flex gap-4 mt-2">
                <div className="h-3 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-between items-center mb-4">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
          </div>
          <div className="h-10 bg-slate-200 rounded-lg" />
        </div>
      ))}
    </div>
  );

  // Error state component
  const renderErrorState = () => (
    <div className="col-span-full text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Unable to Load Doctors
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-slate-600 mb-6">
          Showing fallback data. You can still use filters and search.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Retry Loading
        </button>
      </div>
    </div>
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
              className={` mt-2 ml-2
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
              {typeof window !== "undefined" && window.innerWidth >= 640
                ? "Hide filters"
                : "Close"}
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-8 flex items-start gap-8">
        {/* Sidebar Filters */}
        {showFilters && (
          <Sidebar
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />
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
          {!isLoading && !error && (
            <div className="mb-6 text-slate-600">
              <p>
                Showing {paginatedDoctors.length} of {filteredDoctors.length}{" "}
                doctors
                {searchQuery && ` for "${searchQuery}"`}
                {selectedSpecialty !== "1" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="font-medium">
                      {
                        SPECIALTIES.find((s) => s.id === selectedSpecialty)
                          ?.name
                      }
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && renderSkeleton()}

          {/* Error State */}
          {error && !isLoading && renderErrorState()}

          {/* Doctors Grid */}
          {!isLoading && !error && (
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
              aria-label="Doctors list"
            >
              {paginatedDoctors.length > 0 ? (
                paginatedDoctors.map((doctor: Doctor, idx: number) => (
                  <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500 text-lg mb-4">
                    No doctors found matching your criteria.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="cursor-pointer px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* Pagination */}
          {!isLoading && !error && paginatedDoctors.length > 0 && (
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

// import { useState, useMemo, useCallback } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ChevronRight, ChevronLeft } from "lucide-react";

// import { Sidebar } from "../components/SearchDoctors/Sidebar";
// import { DoctorCard } from "../components/SearchDoctors/DoctorCard";
// import mapImg from "../assets/map.png";
// import filterImg from "../assets/filter.png";
// import { DOCTORS, SPECIALTIES, ICON_MAP } from "../constants/constants";
// import type { Doctor } from "../constants/constants";

// // Update Gender type to match what your Sidebar expects
// type Gender = "male" | "female" | null;

// const PAGE_SIZE = 9;

// const SearchDoctor = () => {
//   // State
//   const [selectedSpecialty, setSelectedSpecialty] = useState<string>("1");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedGender, setSelectedGender] = useState<Gender>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [page, setPage] = useState(1);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   // Filter doctors based on search query, specialty, and gender
//   const filteredDoctors = useMemo(() => {
//     return DOCTORS.filter((doctor: Doctor) => {
//       const matchesSearch =
//         doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

//       // Find the selected specialty object
//       const selectedSpecialtyObj = SPECIALTIES.find(
//         (s) => s.id === selectedSpecialty
//       );

//       // If "1" means "All" or first item in specialties
//       const matchesSpecialty =
//         selectedSpecialty === "1" ||
//         (selectedSpecialtyObj &&
//           doctor.specialty.toLowerCase() ===
//             selectedSpecialtyObj.name.toLowerCase());

//       // Filter by gender
//       const matchesGender = !selectedGender || doctor.gender === selectedGender;

//       return matchesSearch && matchesSpecialty && matchesGender;
//     });
//   }, [searchQuery, selectedSpecialty, selectedGender]);

//   // Paginate filtered doctors
//   const paginatedDoctors = useMemo(() => {
//     const startIndex = (page - 1) * PAGE_SIZE;
//     return filteredDoctors.slice(startIndex, startIndex + PAGE_SIZE);
//   }, [filteredDoctors, page]);

//   const totalPages = Math.ceil(filteredDoctors.length / PAGE_SIZE);
//   const hasNextPage = page < totalPages;
//   const hasPreviousPage = page > 1;

//   // Handlers
//   const handleNextPage = useCallback(() => {
//     if (hasNextPage) {
//       setPage((prev) => prev + 1);
//     }
//   }, [hasNextPage]);

//   const handlePreviousPage = useCallback(() => {
//     if (hasPreviousPage) {
//       setPage((prev) => prev - 1);
//     }
//   }, [hasPreviousPage]);

//   const handleSpecialtySelect = useCallback((id: string) => {
//     setSelectedSpecialty(id);
//     setPage(1);
//   }, []);

//   const handleSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(e.target.value);
//       setPage(1);
//     },
//     []
//   );

//   const handleGenderSelect = useCallback((gender: Gender) => {
//     setSelectedGender(gender);
//     setPage(1);
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSearchQuery("");
//     setSelectedSpecialty("1");
//     setSelectedGender(null);
//     setPage(1);
//   }, []);

//   // Render methods
//   const renderSpecialties = () => (
//     <div className="relative group">
//       <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
//         {SPECIALTIES.map((spec, index) => {
//           const Icon = ICON_MAP[spec.icon];
//           const isSelected = selectedSpecialty === spec.id;

//           return (
//             <motion.button
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 + index * 0.05 }}
//               key={spec.id}
//               onClick={() => handleSpecialtySelect(spec.id)}
//               aria-pressed={isSelected}
//               className={`
//                 flex items-center gap-2 px-5 py-3 rounded-xl border whitespace-nowrap transition-all duration-300
//                 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
//                 ${
//                   isSelected
//                     ? "bg-slate-50 border-primary-200 shadow-sm text-slate-900"
//                     : "bg-white border-slate-200 hover:border-primary-200 hover:shadow-sm text-slate-500"
//                 }
//               `}
//             >
//               <span
//                 className={isSelected ? "text-primary-600" : "text-slate-400"}
//               >
//                 {Icon && <Icon className="w-5 h-5" />}
//               </span>
//               <span className="font-medium">{spec.name}</span>
//             </motion.button>
//           );
//         })}
//       </div>
//     </div>
//   );

//   const renderPagination = () => (
//     <div
//       className={`flex items-center gap-4 ${
//         page === 1 ? "justify-center" : "justify-between"
//       }`}
//     >
//       {hasPreviousPage && (
//         <button
//           onClick={handlePreviousPage}
//           className="px-6 py-2.5 w-[247px] h-[52px] cursor-pointer border rounded-lg font-semibold transition-colors bg-transparent border-primary-500 text-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
//           aria-label="Go to previous page"
//         >
//           Previous page
//         </button>
//       )}

//       <button
//         onClick={handleNextPage}
//         disabled={!hasNextPage}
//         className={`
//           px-6 py-2.5 w-[247px] h-[52px] cursor-pointer border rounded-lg font-semibold transition-colors
//           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
//           ${
//             !hasNextPage
//               ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
//               : "bg-transparent border-primary-500 text-primary-500 hover:bg-primary-50"
//           }
//         `}
//         aria-label="Go to next page"
//         aria-disabled={!hasNextPage}
//       >
//         Next Page
//       </button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen flex flex-col font-sans">
//       {/* Top Navigation Bar */}
//       <motion.div
//         initial={{ y: -10, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8"
//       >
//         {/* Container for sm and above screens */}
//         <div className="hidden sm:flex items-stretch gap-3 md:gap-4 lg:gap-6">
//           {/* Filter Button - First */}
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center justify-center md:justify-start gap-2 px-4 py-3 text-slate-600 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-primary-300 hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 min-w-[90px] md:w-[9rem]"
//             aria-label={showFilters ? "Hide filters" : "Show filters"}
//             aria-expanded={showFilters}
//           >
//             <img
//               src={filterImg}
//               alt="Filter"
//               className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
//             />
//             <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
//               Filter
//             </span>
//             <span className="sr-only md:not-sr-only ml-1">
//               {showFilters ? (
//                 <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
//               ) : (
//                 <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
//               )}
//             </span>
//             <span className="md:hidden text-sm font-medium">Filter</span>
//           </button>

//           {/* Search Input - Second */}
//           <div className="relative flex-1">
//             <input
//               type="text"
//               placeholder="Search doctors by name or specialty"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="w-full h-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-11 md:pl-12 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all shadow-sm text-sm md:text-base"
//               aria-label="Search doctors"
//             />
//             <svg
//               className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>

//           {/* Map Button - Third */}
//           <Link
//             to="/map"
//             className="flex items-center justify-center md:justify-start gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium no-underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 min-w-[90px] md:w-[9rem]"
//             aria-label="View doctors on map"
//           >
//             <img
//               src={mapImg}
//               alt="Map"
//               className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
//             />
//             <span className="hidden md:inline text-sm font-medium whitespace-nowrap">
//               Map
//             </span>
//             <span className="md:hidden text-sm font-medium">Map</span>
//           </Link>
//         </div>

//         {/* Mobile Layout (below sm breakpoint) */}
//         <div className="sm:hidden space-y-3">
//           {/* Mobile Search - Top priority on mobile */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search doctors..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-11 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all shadow-sm"
//               aria-label="Search doctors"
//             />
//             <svg
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>

//           {/* Mobile Action Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
//                 showFilters
//                   ? "bg-primary-50 border-primary-200 text-primary-600"
//                   : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
//               }`}
//               aria-label={showFilters ? "Hide filters" : "Show filters"}
//             >
//               <img src={filterImg} alt="" className="w-5 h-5" />
//               <span className="text-sm font-medium">
//                 {showFilters ? "Hide Filters" : "Filters"}
//               </span>
//             </button>

//             <Link
//               to="/map"
//               className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium no-underline"
//               aria-label="View doctors on map"
//             >
//               <img src={mapImg} alt="" className="w-5 h-5" />
//               <span className="text-sm font-medium">Map</span>
//             </Link>
//           </div>
//         </div>

//         {/* Active Filters Indicator */}
//         {showFilters && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-3 sm:mt-4 flex items-center justify-between text-sm"
//           >
//             <div className="flex items-center gap-2 text-primary-600">
//               <div className="w-2 h-2 rounded-full bg-primary-600" />
//               <span className="font-medium">Filters active</span>
//             </div>
//             <button
//               onClick={() => setShowFilters(false)}
//               className="text-slate-500 hover:text-slate-700 px-2 py-1 rounded transition-colors text-sm"
//             >
//               {typeof window !== "undefined" && window.innerWidth >= 640
//                 ? "Hide filters"
//                 : "Close"}
//             </button>
//           </motion.div>
//         )}
//       </motion.div>

//       {/* Main Content */}
//       <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-8 flex items-start gap-8">
//         {/* Sidebar Filters */}
//         {showFilters && (
//           <Sidebar
//             selectedGender={selectedGender}
//             setSelectedGender={handleGenderSelect}
//             isOpen={showFilters}
//             onClose={() => setShowFilters(false)}
//           />
//         )}

//         {/* Main Content Area */}
//         <div className="flex-1 w-full min-w-0">
//           {/* Specialties Section */}
//           <section className="mb-8" aria-label="Specialties">
//             <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
//               Choose Specialties
//             </h2>
//             {renderSpecialties()}
//           </section>

//           {/* Results Info */}
//           <div className="mb-6 text-slate-600">
//             <p>
//               Showing {paginatedDoctors.length} of {filteredDoctors.length}{" "}
//               doctors
//               {searchQuery && ` for "${searchQuery}"`}
//               {selectedSpecialty !== "1" && (
//                 <>
//                   {" "}
//                   in{" "}
//                   <span className="font-medium">
//                     {SPECIALTIES.find((s) => s.id === selectedSpecialty)?.name}
//                   </span>
//                 </>
//               )}
//             </p>
//           </div>

//           {/* Doctors Grid */}
//           <motion.section
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
//             aria-label="Doctors list"
//           >
//             {paginatedDoctors.length > 0 ? (
//               paginatedDoctors.map((doctor: Doctor, idx: number) => (
//                 <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-slate-500 text-lg mb-4">
//                   No doctors found matching your criteria.
//                 </p>
//                 <button
//                   onClick={clearAllFilters}
//                   className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
//                 >
//                   Clear all filters
//                 </button>
//               </div>
//             )}
//           </motion.section>

//           {/* Pagination */}
//           {paginatedDoctors.length > 0 && (
//             <nav aria-label="Pagination">
//               {renderPagination()}
//               <div className="mt-4 text-center text-slate-500 text-sm">
//                 Page {page} of {totalPages}
//               </div>
//             </nav>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default SearchDoctor;
