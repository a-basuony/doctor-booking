import { useState } from "react";
import { TbMenu3 } from "react-icons/tb";
import { X, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Bookings", link: "/Booking" },
    { name: "Chat", link: "/chat" },
  ];

  return (
    <nav className="w-full bg-white pt-6 pb-4 px-4 flex flex-col gap-4">
      
      {/* Mobile Navbar */}
      <div className="flex items-center justify-between md:hidden w-full">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/images/heart-logo.png"
            alt="logo"
            className="w-10 h-10"
          />
        </div>

        {/* Menu + Profile */}
        <div className="flex items-center gap-2">

          {openMenu && (
            <div className="flex items-center gap-2">
              {menuItems.map((item) => (
                <span
                  key={item.name}
                  onClick={() => {
                    navigate(item.link);
                    setOpenMenu(false);
                  }}
                  className="px-6 py-2 text-[16px] text-gray-800 cursor-pointer border border-gray-300 rounded-lg"
                >
                  {item.name}
                </span>
              ))}

              <X
                className="w-10 h-10 cursor-pointer p-1.5 rounded-xl text-gray-500"
                onClick={() => setOpenMenu(false)}
              />
            </div>
          )}

          {!openMenu && (
            <TbMenu3
              className="w-10 h-10 cursor-pointer p-1.5 rounded-xl"
              onClick={() => setOpenMenu(true)}
            />
          )}

          {/* Profile Image */}
          <img
            src="/images/profile.jpg"
            alt="User profile"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between w-full">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/images/heart-logo.png"
            alt="logo"
            className="w-10 h-10"
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 relative">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-7 h-7" />
          <input
            type="text"
            placeholder="Search about specialty, doctor"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-100 text-gray-400 placeholder-gray-400 text-xl focus:outline-none border-none"
          />
        </div>

        {/* Menu + Notification + Profile */}
        <div className="flex items-center gap-2">

          {openMenu && (
            <div className="flex items-center gap-3">
              {menuItems.map((item) => (
                <span
                  key={item.name}
                  onClick={() => {
                    navigate(item.link);
                    setOpenMenu(false);
                  }}
                  className="px-6 py-2 text-[16px] text-gray-800 cursor-pointer border-2 border-gray-800 rounded-lg"
                >
                  {item.name}
                </span>
              ))}

              <X
                className="w-10 h-10 cursor-pointer p-1.5 rounded-xl text-gray-500"
                onClick={() => setOpenMenu(false)}
              />
            </div>
          )}

          {!openMenu && (
            <TbMenu3
              className="w-10 h-10 cursor-pointer p-1.5 rounded-xl"
              onClick={() => setOpenMenu(true)}
            />
          )}

          <Bell className="w-10 h-10 p-1.5 rounded-xl cursor-pointer text-gray-700" />

          <img
            src="/images/profile.jpg"
            alt="User profile"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
}
