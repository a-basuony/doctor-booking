import { Box, Typography } from "@mui/material";
import { FaClock, FaStar } from "react-icons/fa";


const MapCard = ({ doctor, isSelected, onClick }) => {
   return (
      <Box
         onClick={onClick}
         className={`flex items-center gap-3 p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? "bg-blue-50 border-2 border-blue-500" : "bg-white border border-gray-200 hover:shadow-md"
            }`}
         sx={{
            boxShadow: isSelected ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
         }}
      >
         <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
         />
         <div>
            <Typography variant="body1" className="font-bold">
               {doctor.name}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
               {doctor.specialty} | {doctor.location.name}
            </Typography>
            <div className="flex items-center gap-4 mt-1">
               <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500 text-sm" />
                  <span className="text-sm font-semibold">{doctor.rating}</span>
               </div>
               <div className="flex items-center gap-1 text-gray-500">
                  <FaClock className="text-xs" />
                  <span className="text-sm">
                     {doctor.availability}
                  </span>
               </div>
            </div>
         </div>
      </Box>
   );
};

export default MapCard;