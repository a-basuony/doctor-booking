import React from "react";
import { Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
// import { Doctor } from "../../types/appointment";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  timeStart: string;
  timeEnd: string;
  price: number;
  image: string;
}

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
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg border border-slate-100 transition-shadow duration-300 flex flex-col justify-between"
    >
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 line-clamp-1">
            {doctor.name}
          </h3>
          <p className="text-sm text-slate-500 mb-1">
            {doctor.specialty} | {doctor.hospital}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-slate-700">
                {doctor.rating}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">
                {doctor.timeStart} - {doctor.timeEnd}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-500">
            Price<span className="text-xs text-slate-400">/hour</span>
          </span>
          <span className="text-lg font-bold text-red-500">
            ${doctor.price}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-primary-200"
        >
          Book appointment
        </motion.button>
      </div>
    </motion.div>
  );
};
