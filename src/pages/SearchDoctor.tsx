import { useState } from "react";

import { Sidebar } from "../components/SearchDoctors/Sidebar";
import { DoctorCard } from "../components/SearchDoctors/DoctorCard";
import mapImg from "../assets/map.png";
import filterImg from "../assets/filter.png";
// DOCTORS,
import { DOCTORS, SPECIALTIES, ICON_MAP } from "../constants/constants";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import { useDoctorsNearYou } from "../hooks/useDoctorsNearYou";
// import { DoctorCardSkeleton } from "../components/SearchDoctors/DoctorCardSkeleton";
// import { ErrorMessage } from "../components/SearchDoctors/ErrorCard";

const SearchDoctor = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("1");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >("male");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 9;
  const startIndex = (page - 1) * PAGE_SIZE;

  const paginatedDoctors = DOCTORS.slice(startIndex, startIndex + PAGE_SIZE);

  // const { data, isLoading, isError } = useDoctorsNearYou(page);
  // console.log("API doctors:", data);
  // const doctors = data?.doctors ?? [];
  const currentPage = page;

  // if (isError) return <p>Something went wrong</p>;

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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Filter & Search & Map Action */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="
            max-w-[1400px] mx-auto w-full
            px-4 md:px-8 pt-8
            flex flex-col md:flex-row
            items-stretch
            gap-4 md:gap-6
        "
      >
        {/* filter input */}
        <div
          className="w-1/4  md:w-[9rem]  flex items-center order-last md:order-first text-slate-500 border border-slate-200  rounded-lg bg-white shadow-sm cursor-pointer hover:border-primary-300 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center gap-2 px-3 py-2 w-80">
            <img src={filterImg} alt="Filter" className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </div>

          <div className=" flex items-center gap-2 px-2 transition-all duration-75">
            <div className="h-12 w-[1px] bg-stone-200 "></div>
            {showFilters && <ChevronLeft className="w-5 h-5" />}
            {!showFilters && <ChevronRight className="w-5 h-5" />}
          </div>
        </div>
        <input
          type="text"
          placeholder="Search doctors"
          className=" flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm"
        />
        <button className="w-1/4  md:w-[9rem]  cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium">
          <Link
            to="/map"
            className="no-underline  text-gray-500 text-sm font-medium"
          >
            <img src={mapImg} className="w-4 h-4 mr-2" />
            Map
          </Link>
        </button>
      </motion.div>
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-8 flex items-start">
        <div>
          {/* Left Sidebar Filter */}
          {showFilters && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className=" block flex-shrink-0 space-y-8 pr-6"
            >
              <Sidebar
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
              />
            </motion.div>
          )}
        </div>
        {/* Right Content */}
        <div className="flex-1 w-full min-w-0">
          <div>
            {/* Specialties Carousel */}
            <div className="mb-8">
              <h2 className="text-xl font-serif font-bold text-slate-900 mb-4">
                Choose Specialties
              </h2>
              <div className="relative group">
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                  {SPECIALTIES.map((spec, index) => {
                    const Icon = ICON_MAP[spec.icon] || Map;
                    const isSelected = selectedSpecialty === spec.id;
                    return (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        key={spec.id}
                        onClick={() => setSelectedSpecialty(spec.id)}
                        className={` cursor-pointer
                        flex items-center gap-2 px-5 py-3 rounded-xl border whitespace-nowrap transition-all duration-300
                        ${
                          isSelected
                            ? "bg-slate-50 border-primary-200 shadow-sm"
                            : "bg-white border-slate-200 hover:border-primary-200 hover:shadow-sm"
                        }
                      `}
                      >
                        <span
                          className={`${
                            isSelected ? "text-primary-600" : "text-slate-400"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <span
                          className={`font-medium ${
                            isSelected ? "text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {spec.name}
                        </span>
                      </motion.button>
                    );
                  })}
                  <button className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors sticky right-0 shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Doctor Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
            >
              {/* {isError ? (
                <ErrorMessage
                  message={
                    error instanceof Error
                      ? error.message
                      : "Failed to load doctors!"
                  }
                  retry={() => refetch()}
                />
              ) : isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <DoctorCardSkeleton key={idx} />
                ))
              ) : DOCTORS.length === 0 ? (
                <p className="col-span-full text-center text-slate-500">
                  No doctors found near you.
                </p>
              ) : (
              )} */}
              {/* {DOCTORS.map((doctor, idx) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
              ))} */}
              {paginatedDoctors.map((doctor, idx) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={idx} />
              ))}
            </motion.div>
            {/* Pagination */}
            <div
              className={`flex items-center gap-4 ${
                currentPage === 1 ? "justify-center" : "justify-between"
              }`}
            >
              {/* Previous Page Button */}
              {currentPage > 1 && (
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={startIndex === 0}
                  className="px-6 py-2.5 w-[247px] h-[52px] cursor-pointer border rounded-lg font-semibold transition-colors bg-transparent border-primary-500 text-primary-500 hover:bg-primary-50"
                >
                  Previous page
                </button>
              )}

              {/* Next Page Button */}
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={startIndex + PAGE_SIZE >= DOCTORS.length}
                className={`px-6 py-2.5 w-[247px] h-[52px] cursor-pointer border rounded-lg font-semibold transition-colors ${
                  DOCTORS.length === 0
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-transparent border-primary-500 text-primary-500 hover:bg-primary-50"
                }`}
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchDoctor;
