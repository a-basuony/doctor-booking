import { Box, Typography } from "@mui/material";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { DOCTORS } from "../services/doctorService";
import { useState } from "react";
import MapCard from "../components/map/MapCard";

const DoctorMapResults = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);

  const mapCenterLat = selectedDoctor
    ? selectedDoctor.location.lat
    : 30.0444;

  const mapCenterLng = selectedDoctor
    ? selectedDoctor.location.lng
    : 31.2357;

  const markers = DOCTORS.map(
    (doc) => `${doc.location.lat},${doc.location.lng}`
  ).join("|");

  const mapIframeSrc = `http://maps.google.com/maps?q=${mapCenterLat},${mapCenterLng}&hl=en&z=12&output=embed&markers=${markers}`;

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen max-w-screen-1xl mx-auto shadow-2xl rounded-xl overflow-hidden">
      {/* Doctors List */}
      <Box className="lg:w-96 w-full flex-shrink-0 p-4 bg-white flex flex-col">
        <Typography variant="h6" className="font-bold mb-3">
          {DOCTORS.length} Results
        </Typography>

        <div className="overflow-y-auto pr-2" style={{ maxHeight: "65vh" }}>
          {DOCTORS.map((doctor, index) => (
            <MapCard
              key={index}
              doctor={doctor}
              isSelected={selectedDoctor?.id === doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
            />
          ))}
        </div>
      </Box>

      {/* Map */}
      <Box className="flex-1 relative p-3">
        <button
          onClick={handleGoBack}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          aria-label="Go back"
        >
          <FaTimes className="text-xl text-gray-700" />
        </button>

        <iframe
          src={mapIframeSrc}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          aria-hidden="false"
          className="w-full h-full min-h-96 rounded-[30px]"
        ></iframe>

        {/* Address */}
        <Box
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl flex items-center gap-2"
          sx={{ minWidth: 260 }}
        >
          <FaMapMarkerAlt className="text-blue-600 text-lg" />
          <Typography variant="body2" className="font-semibold text-gray-700">
            {selectedDoctor?.location.address}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default DoctorMapResults;
