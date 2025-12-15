import React from "react";
import { Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Doctor } from "../../constants/constants";

interface DoctorCardProps {
  doctor: Doctor;
  index: number;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg border flex flex-col"
    >
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-slate-900">{doctor.name}</h3>

          <p className="text-sm text-slate-500">
            {doctor.specialty} | {doctor.hospital}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold">{doctor.rating}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs">
                {doctor.timeStart} - {doctor.timeEnd}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-between items-center mb-4">
        <span className="text-sm text-slate-500">Price / hour</span>
        <span className="text-lg font-bold text-red-500">${doctor.price}</span>
      </div>

      <Link
        to={`/book-appointment/${doctor.id}`}
        className=" no-underline block text-center py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
      >
        Book appointment
      </Link>
    </motion.div>
  );
};
