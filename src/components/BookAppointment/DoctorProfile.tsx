import React, { useState } from "react";
import { MessageSquare, Check, Users, Award, Star, MapPin } from "lucide-react";
import { FadeIn } from "./FadeIn";
import chatImage from "../../assets/vector.png";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

export const DoctorProfile: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const mapCenterLat = 30.0444;
  const mapCenterLng = 31.2357;

  const mapIframeSrc = `https://maps.google.com/maps?q=${mapCenterLat},${mapCenterLng}&z=12&output=embed`;

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
    toast.success(
      isFavorite ? "Removed doctor from favorites" : "Added doctor to favorites"
    );
  };

  return (
    <div className="sticky top-8 w-full">
      <FadeIn delay={100}>
        <div className="bg-gray-200/30 rounded-3xl p-6 shadow-xl shadow-slate-100">
          {/* Header Icons */}
          <div className="flex justify-between mb-4">
            <button
              onClick={handleFavorite}
              className=" cursor-pointer bg-white w-11 h-11 rounded-full flex items-center justify-center hover:text-red-500 transition"
            >
              {isFavorite ? (
                <FaHeart className="text-xl text-red-500" />
              ) : (
                <FaRegHeart className="text-xl text-gray-400" />
              )}
            </button>

            <Link
              to="/chat"
              className="bg-white w-11 h-11 rounded-full flex items-center justify-center hover:text-blue-500 transition"
            >
              <img src={chatImage} alt="Chat" className="w-5 h-5" />
            </Link>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src="https://picsum.photos/150/150?random=3"
                alt="Dr. Jessica Turner"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-4 right-0 bg-blue-600 text-white rounded-full border-2 border-white p-1">
                <Check size={12} strokeWidth={4} />
              </div>
            </div>

            <h1 className="text-xl font-serif text-slate-800 mb-1">
              Dr. Jessica Turner
            </h1>
            <span className="text-gray-500 text-sm">Pulmonologist</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-8 border-b pb-8">
            {[
              { icon: <Users size={18} />, value: "2,000+", label: "patients" },
              { icon: <Award size={18} />, value: "10+", label: "experience" },
              {
                icon: <Star size={18} className="fill-slate-700" />,
                value: "4.5",
                label: "rating",
              },
              {
                icon: <MessageSquare size={18} />,
                value: "1,872",
                label: "reviews",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-700">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {item.value}
                </div>
                <div className="text-[10px] text-gray-400 uppercase">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-slate-800 mb-3">About me</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Dr. Jessica Turner is a board-certified pulmonologist with over 8
              years of experience in diagnosing and treating respiratory
              conditions.{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Read more
              </span>
            </p>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-serif text-lg text-slate-800 mb-3">Location</h3>
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <iframe
                src={mapIframeSrc}
                className="w-full h-full border-0"
                loading="lazy"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">
                    129, El-Nasr Street, Cairo, Egypt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
