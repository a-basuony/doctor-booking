import { FiSearch } from "react-icons/fi";
import { MdOutlineStarOutline, MdStar } from "react-icons/md";
import { useNavbarLogic } from "../../../hooks/useNavbar";
import { useEffect, useMemo, useState } from "react";
import type { Doctor } from "../../../hooks/useNavbar";

type Props = {
  placeholder: string;
};

export default function SearchCard({ placeholder }: Props) {
  const {
    query,
    results,
    handleSearchChange,
    goToDoctorById,
  } = useNavbarLogic();

  const [showDropdown, setShowDropdown] = useState(false);

  // التحكم في ظهور الـ dropdown
  useEffect(() => {
    setShowDropdown(results.length > 0);
  }, [results]);

  // تحسين الأداء
  const renderedResults = useMemo(
    () =>
      results.map((doctor: Doctor) => (
        <li
          key={doctor.id}
          onClick={() => goToDoctorById(doctor.id)}
          className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex flex-col md:flex-row gap-2 md:gap-4 items-center mb-3 shadow-sm"
        >
          <img
            src={
              doctor.profile_photo
                ? `https://round8-backend-team-one.huma-volve.com/storage/${doctor.profile_photo}`
                : "/images/Ellipse1539.jpeg"
            }
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 flex flex-col gap-1 font-georgia font-normal">
            <span className="text-gray-800 text-xl">{doctor.name}</span>
            <span className="text-gray-500 text-sm">
              {doctor.specialty?.name}
            </span>
            <span className="text-gray-500 text-sm">
              {doctor.clinic_address}
            </span>
            <span className="text-gray-500 text-sm">
              Experience: {doctor.experience_years} years
            </span>
            <span className="text-gray-500 text-sm">
              Session Price: ${doctor.session_price}
            </span>
            <p className="text-gray-600 text-sm line-clamp-2">
              {doctor.bio}
            </p>
          </div>
        </li>
      )),
    [results, goToDoctorById]
  );

  return (
    <div className="border border-gray-400 rounded-3xl shadow-sm m-5 overflow-hidden bg-white relative">
      {/* Top Search Section */}
      <div className="h-64 relative flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none grid grid-cols-8 gap-6 p-6 opacity-40">
          {[...Array(48)].map((_, i) => (
            <div key={i} className="flex items-center text-blue-500">
              <MdStar />
              <MdOutlineStarOutline />
            </div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-xs">
          <div className="bg-white border border-blue-400 rounded-2xl px-5 py-3 flex items-center gap-3 shadow">
            <FiSearch />
            <input
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search by ${placeholder}`}
              className="w-full outline-none"
            />
          </div>

          {/* Dropdown Results */}
          <ul
            className={`absolute top-full left-0 w-full bg-white rounded-xl shadow-lg mt-2 max-h-80 overflow-y-auto z-50 p-3 transition-opacity duration-300
              ${showDropdown ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {renderedResults}
          </ul>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-7 py-6 shadow-[0_-4px_10px_rgba(0,0,0,0.12)]">
        <h3 className="text-xl font-serif mb-2">Search for a Doctor</h3>
        <p className="text-sm text-gray-600">
          Easily browse by specialty, location, or doctor name.
        </p>
      </div>
    </div>
  );
}
 