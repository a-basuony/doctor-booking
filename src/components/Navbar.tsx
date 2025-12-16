import { memo } from "react";
import { TbMenu3 } from "react-icons/tb";
import { X } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { useNavbarLogic } from "../hooks/useNavbar";
import Notifications from "./Notifications";

const MenuItem = memo(({ item, onClick }: { item: { name: string; link: string }; onClick: () => void }) => (
  <span
    onClick={onClick}
    className="px-6 py-2 text-[15px] text-gray-800 cursor-pointer border-2 border-white bg-slate-100 rounded-xl font-sans"
  >
    {item.name}
  </span>
));

export default function Navbar() {
  const { openMenu, toggleMenu, handleNavigate, query, handleSearch } = useNavbarLogic();

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Bookings", link: "/BookingPage" },
    { name: "Chat", link: "/chat" },
  ];

  return (
    <nav className="w-full bg-white pt-6 pb-4 px-4 flex flex-col gap-4">
      {/* Mobile */}
      <div className="flex items-center justify-between md:hidden w-full">
        <img src="/images/heart-logo.png" alt="logo" className="w-10 h-10" />
        <div className="flex items-center gap-2">
          {openMenu ? (
            <div className="flex items-center gap-2">
              {menuItems.map(item => (
                <MenuItem key={item.name} item={item} onClick={() => handleNavigate(item.link)} />
              ))}
              <X
                className="w-10 h-10 cursor-pointer p-1.5 rounded-xl text-gray-500 border-2 border-white bg-slate-100"
                onClick={toggleMenu}
              />
            </div>
          ) : (
            <TbMenu3 className="w-10 h-10 cursor-pointer p-1.5 rounded-xl" onClick={toggleMenu} />
          )}
          <img
            src="/images/Ellipse1539.jpeg"
            alt="User profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => handleNavigate("/profile")}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between w-full">
        <img src="/images/heart-logo.png" alt="logo" className="w-10 h-10" />

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4 relative">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-7 h-7" />
          <input
            type="text"
            placeholder="Search about specialty, doctor"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-100 text-gray-600 placeholder-gray-400 text-xl focus:outline-none border-none"
          />
        </div>

        {/* Menu & Icons */}
        <div className="flex items-center gap-2">
          {openMenu ? (
            <div className="flex items-center gap-3">
              {menuItems.map(item => (
                <MenuItem key={item.name} item={item} onClick={() => handleNavigate(item.link)} />
              ))}
              <X
                className="w-10 h-10 cursor-pointer p-1.5 border-2 border-white bg-slate-100 rounded-xl text-gray-500"
                onClick={toggleMenu}
              />
            </div>
          ) : (
            <TbMenu3 className="w-10 h-10 cursor-pointer p-1.5 rounded-xl" onClick={toggleMenu} />
          )}
           {/* <Bell className="w-10 h-10 p-1.5 rounded-xl cursor-pointer text-gray-700 border-2 border-white bg-slate-100" /> */}
           <Notifications />
          <img
            src="/images/Ellipse1539.jpeg"
            alt="User profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => handleNavigate("/profile")}
          /> 
          
        </div>
      </div>
    </nav>
  );
}