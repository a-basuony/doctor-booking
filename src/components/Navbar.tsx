import { memo,useMemo } from "react";
import { TbMenu3 } from "react-icons/tb";
import { X } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { useNavbarLogic } from "../hooks/useNavbar";
import type { Doctor } from "../hooks/useNavbar";
import Notification from "../components/Notifications";




const MenuItem = memo(
  ({ item, onClick }: { item: { name: string; link: string }; onClick: () => void }) => (
    <span
      onClick={onClick}
      className="px-6 py-2 text-[15px] text-gray-800 cursor-pointer border-2 border-white bg-slate-100 rounded-xl font-sans"
    >
      {item.name}
    </span>
  )
);

const IMAGE_BASE_URL =
  "https://round8-backend-team-one.huma-volve.com/storage/";


export default function Navbar() {
  const {
    openMenu,
    toggleMenu,
    handleNavigate,
    query,
    handleSearchChange,
    goToDoctorDetails,
    results,
    goToDoctorById,
  } = useNavbarLogic();

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Bookings", link: "/BookingPage" },
    { name: "Chat", link: "/chat" },
  ];

  const memoizedResults = useMemo(() => results, [results]);
  return (
    <nav className="w-full bg-white pt-6 pb-4 px-6 flex flex-col gap-4">
      {/* Mobile */}
      <div className="relative md:hidden w-full">
        <div className="flex items-center justify-between w-full">
          <img src="/images/heart-logo.png" alt="logo" className="w-10 h-10" />
          <div className="flex items-center gap-2">
            {openMenu ? (
              <X className="w-10 h-10 cursor-pointer p-1.5 rounded-xl text-gray-500 border-2 border-white bg-slate-100" onClick={toggleMenu} />
            ) : (
              <TbMenu3 className="w-10 h-10 cursor-pointer p-1.5 rounded-xl" onClick={toggleMenu} />
            )}
            <img
              src="/images/Ellipse_1539.jpeg"
              alt="User profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => handleNavigate("/profile")}
            />
          </div>
        </div>

        {openMenu && (
          <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-2xl shadow-lg p-4 z-50">
            <div className="flex flex-col gap-3">
              {menuItems.map(item => (
                <MenuItem
                  key={item.name}
                  item={item}
                  onClick={() => handleNavigate(item.link)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between w-full">
        <img src="/images/heart-logo.png" alt="logo" className="w-10 h-10" />

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4 relative">
          <CiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-7 h-7 cursor-pointer"
            onClick={goToDoctorDetails}
          />
          <input
            type="text"
            placeholder="Search about specialty, doctor"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToDoctorDetails();
            }}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-100 text-gray-600 placeholder-gray-400 text-xl focus:outline-none border-none"
          />

          {/* Dropdown */}
          {memoizedResults.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white rounded-xl shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
              {memoizedResults.map((doctor: Doctor) => (
                <li
                  key={doctor.id}
                  onClick={() => goToDoctorById(doctor.id)}
                  className="px-4 py-3 hover:bg-gray-100 duration-500 cursor-pointer flex flex-col md:flex-row gap-2 md:gap-4 items-center pb-5 rounded-lg shadow-md mb-5"
                >
                 <img
  src={
    doctor.profile_photo
      ? `${IMAGE_BASE_URL}${doctor.profile_photo}`
      : "/images/profile.jpg"
  }
  alt={doctor.name}
  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
/>


                  <div className="flex-1 flex flex-col gap-1 font-georgia font-normal">
                    <span className="text-gray-800 text-xl pl-5">{doctor.name}</span>
                    <div className="flex-1 flex flex-col gap-1 pl-5">
                      <span className="text-gray-500 text-sm">{doctor.specialty?.name}</span>
                      <span className="text-gray-500 text-sm">{doctor.clinic_address}</span>
                      <span className="text-gray-500 text-sm">
                        Experience:{" "}
                        <span className="text-lg text-sky-600 underline">
                          {doctor.experience_years} years
                        </span>
                      </span>
                      <span className="text-gray-500 text-sm">
                        Session Price:{" "}
                        <span className="text-green-600 text-lg">$</span>
                        <span className="text-green-600 text-lg">{doctor.session_price}</span>
                      </span>
                      <p className="text-gray-600 text-sm line-clamp-2">{doctor.bio}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Menu & Icons */}
        <div className="flex items-center gap-2">
          {openMenu ? (
            <div className="flex items-center gap-3">
              {menuItems.map(item => (
                <MenuItem key={item.name} item={item} onClick={() => handleNavigate(item.link)} />
              ))}
              <X className="w-10 h-10 cursor-pointer p-1.5 border-2 border-white bg-slate-100 rounded-xl text-gray-500" onClick={toggleMenu} />
            </div>
          ) : (
            <TbMenu3 className="w-10 h-10 cursor-pointer p-1.5 rounded-xl" onClick={toggleMenu} />
          )}

<Notification />

          <img
            src="/images/Ellipse_1539.jpeg"
            alt="User profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => handleNavigate("/profile")}
          />
        </div>
      </div>
    </nav>
  );
}
