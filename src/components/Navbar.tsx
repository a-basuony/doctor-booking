import { useState } from "react";
import { TbMenu3 } from "react-icons/tb";
import { X, Bell } from "lucide-react";


export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <nav className="w-full bg-white py-4 px-4 flex flex-col gap-4">
      {/* Mobile Navbar */}
      <div className="flex items-center justify-between md:hidden w-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={'/imgs/heart-logo.png'} alt="logo" className="w-10 h-10" />
        </div>

        {/* Profile + Menu */}
        <div className="flex items-center gap-3">
          
          {openMenu ? (
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Home</button>
              <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Bookings</button>
              <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Chat</button>
              <X
                className="w-7 h-7 cursor-pointer text-gray-500"
                onClick={() => setOpenMenu(false)}
              />
            </div>
          ) : (
            <TbMenu3
              className="w-7 h-7 cursor-pointer text-black"
              onClick={() => setOpenMenu(true)}
            />
          )}
          <img
            src={'./imgs/Ellipse1539.jpeg'}
            alt="User profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent"
          />
          
        </div>
        
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={'/imgs/heart-logo.png'} alt="logo" className="w-10 h-10" />
        </div>

        <div className="flex-1 max-w-xl mx-4 flex-shrink-0 flex items-center">
          <input
            type="text"
            placeholder="Search about specialty, doctor"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-500 shadow-sm"
          />
        </div>

        <div className="flex items-center flex-shrink-0">
          {openMenu ? (
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Home</button>
              <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Bookings</button>
              <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Chat</button>
              <X
                className="w-7 h-7 cursor-pointer text-gray-500"
                onClick={() => setOpenMenu(false)}
              />
            </div>
          ) : (
            <TbMenu3
              className="w-7 h-7 cursor-pointer text-black"
              onClick={() => setOpenMenu(true)}
            />
          )}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <Bell className="w-6 h-6 cursor-pointer text-gray-700" />
          <img
            src={'./imgs/Ellipse1539.jpeg'}
            alt="User profile"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
}
