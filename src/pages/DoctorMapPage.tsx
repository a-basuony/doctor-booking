import { Box, Typography } from "@mui/material";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { DOCTORS } from "../services/doctorService";
import { useState } from "react";
import MapCard from "../components/map/MapCard";

const DoctorMapResults = () => {
   const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);

   const mapCenterLat = selectedDoctor ? selectedDoctor.location.lat : 20.0444;
   const mapCenterLng = selectedDoctor ? selectedDoctor.location.lng : 31.2357;

   const markers = DOCTORS.map(doc => `${doc.location.lat},${doc.location.lng}`);

   const markersString = markers.join('|');


   const mapIframeSrc = `http://maps.google.com/maps?q=${mapCenterLat},${mapCenterLng}&hl=en&z=12&output=embed&markers=${markersString}`;
   const handleGoBack = () => {
      window.history.back()
   };


   return (
      <div className="flex flex-col lg:flex-row h-screen max-w-screen-1xl mx-auto shadow-2xl rounded-xl ">
         <Box className="lg:order-1 order-2 w-full lg:w-96 flex-shrink-0 p-3 mt-1 md:mt-4 bg-white flex flex-col ">
            <Typography variant="h6" className="font-bold pb-2">
               {DOCTORS.length} Results
            </Typography>

            <div className=" pr-1" style={{ maxHeight: "60vh" }}>
               {DOCTORS.map((doctor, index) => (
                  <MapCard
                     key={index}
                     doctor={doctor}
                     isSelected={selectedDoctor && selectedDoctor.id === doctor.id}
                     onClick={() => setSelectedDoctor(doctor)}
                  />
               ))}
            </div>
         </Box>

         <Box className="lg:order-1 flex-1 mt-4 md:mt-9 mb-2 md:mb-9 p-4 pr-5 relative rounded-xl ">
            <button
               onClick={handleGoBack}
               className="absolute top-5 right-7 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
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
               className="w-full h-full min-h-96  rounded-[30px]"
            ></iframe>

            <Box
               className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl flex items-center gap-2"
               sx={{ minWidth: 255 }}
            >
               <FaMapMarkerAlt className="text-blue-600 text-lg" />
               <Typography variant="body2" className="font-semibold text-gray-700">
                  {selectedDoctor?.location.address}
               </Typography>
            </Box>
         </Box>
      </div>

   );
}

export default DoctorMapResults;