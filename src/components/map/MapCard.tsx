import { Box, Typography } from "@mui/material";
import { FaClock, FaStar } from "react-icons/fa";
import type { IDoctor } from "../../types";
import UserAvatar from "../UserAvatar";

interface MapCardProps {
  doctor: IDoctor;
  isSelected: boolean;
  onClick: () => void;
}

const MapCard: React.FC<MapCardProps> = ({ doctor, isSelected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      className={`flex items-start gap-3 p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-blue-50 border-2 border-blue-500"
          : "bg-white border border-gray-200 hover:shadow-md"
      }`}
      sx={{ boxShadow: isSelected ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none" }}
    >
      <UserAvatar
        name={doctor.name}
        image={doctor.image}
        size={64}
        className="flex-shrink-0"
        sx={{ borderRadius: "0.5rem" }}
      />

      <div className="flex flex-col">
        <Typography variant="body1" className="font-bold">
          {doctor.name}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          {doctor.specialty} | {doctor.location.address}
        </Typography>

        <div className="flex items-center gap-4 mt-1 text-sm">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500 text-sm" />
            <span className="font-semibold">{doctor.rating}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <FaClock className="text-xs" />
            <span>{doctor.availability}</span>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default MapCard;
