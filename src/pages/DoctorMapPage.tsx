import { Box, Typography } from "@mui/material";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { DOCTORS } from "../services/doctorService";
import { useState } from "react";
import MapCard from "../components/map/MapCard";

const DoctorMapResults = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);

  const mapCenterLat = selectedDoctor ? selectedDoctor.location.lat : 30.0444;
  const mapCenterLng = selectedDoctor ? selectedDoctor.location.lng : 31.2357;

  const markers = DOCTORS.map(
    (doc) => `${doc.location.lat},${doc.location.lng}`
  );

  const markersString = markers.join("|");

  const mapIframeSrc = `http://maps.google.com/maps?q=${mapCenterLat},${mapCenterLng}&hl=en&z=12&output=embed&markers=${markersString}`;
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex h-screen max-w-screen-1xl mx-auto shadow-2xl rounded-xl overflow-hidden">
      <Box className="w-96 flex-shrink-0 p-5 mt-7 bg-white flex flex-col">
        <Typography variant="h6" className="font-bold mb-4">
          {DOCTORS.length} Results
        </Typography>
        <div className="overflow-y-auto pr-2" style={{ maxHeight: "75vh" }}>
          {DOCTORS.map((doctor, index) => (
            <MapCard
              key={index}
              doctor={doctor}
              // عند الضغط، يتم تحديث selectedDoctor، وهذا بدوره يحدث mapCenterLat/Lng، وبالتالي يتحدث الـ iframe
              isSelected={selectedDoctor && selectedDoctor.id === doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
            />
          ))}
        </div>
      </Box>

      <Box className="flex-grow mt-7 relative overflow-hidden rounded-xl">
        <button
          onClick={handleGoBack}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <FaTimes className="text-xl text-gray-700" />
        </button>

        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapIframeSrc}
          aria-hidden="false"
          className="h-full w-full rounded-xl"
        ></iframe>

        <Box
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl flex items-center gap-2"
          sx={{ minWidth: 255 }}
        >
          <FaMapMarkerAlt className="text-blue-600 text-lg" />
          <Typography variant="body2" className="font-semibold text-gray-700">
            {selectedDoctor
              ? selectedDoctor.location.address
              : "129, El-Nasr Street, Cairo, Egypt"}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default DoctorMapResults;
