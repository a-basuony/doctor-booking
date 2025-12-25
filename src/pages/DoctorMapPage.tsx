import { Box, Typography } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapCard from "../components/map/MapCard";
import { api } from "../services/api";
import type { IDoctor } from "../types";

interface ApiDoctor {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  address: string | null;
  profile_photo: string | null;
  specialty: {
    id: number;
    name: string;
    image: string;
  };
  license_number: string;
  about_me: string;
  session_price: number;
  clinic_address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  experience_years: number;
}

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) return "??";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Generate avatar SVG with initials
const generateAvatarSVG = (name: string): string => {
  const initials = getInitials(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#145DB8"/>
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="central">
        ${initials}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Create custom marker icon with doctor image
const createDoctorMarker = (
  imageUrl: string | null,
  doctorName: string,
  isActive: boolean = false
) => {
  const actualImage = imageUrl || generateAvatarSVG(doctorName);
  const borderColor = isActive ? "#145DB8" : "white";
  const borderWidth = isActive ? "4px" : "3px";
  const boxShadow = isActive
    ? "0 0 0 4px rgba(20, 93, 184, 0.3), 0 4px 12px rgba(0,0,0,0.4)"
    : "0 2px 8px rgba(0,0,0,0.3)";
  const size = isActive ? "60px" : "50px";

  return L.divIcon({
    className: "custom-doctor-marker",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <img
          src="${actualImage}"
          style="
            width: ${size};
            height: ${size};
            border-radius: 50%;
            border: ${borderWidth} solid ${borderColor};
            box-shadow: ${boxShadow};
            object-fit: cover;
            background: white;
            transition: all 0.3s ease;
          "
          onerror="this.src='${generateAvatarSVG(doctorName)}'"
        />
      </div>
    `,
    iconSize: isActive ? [60, 60] : [50, 50],
    iconAnchor: isActive ? [30, 30] : [25, 25],
    popupAnchor: [0, isActive ? -30 : -25],
  });
};

const DoctorMapResults = () => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
        console.log("API Response:", response.data);

        // Handle both array and object responses
        const apiDoctors = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        // Map API doctors to IDoctor format
        const mappedDoctors: IDoctor[] = apiDoctors
          .filter(
            (doc: ApiDoctor) =>
              doc.location?.latitude && doc.location?.longitude
          )
          .map((doc: ApiDoctor) => ({
            id: String(doc.id),
            name: doc.name,
            specialty: doc.specialty?.name || "General Practitioner",
            hospital: doc.clinic_address || doc.address || "Medical Center",
            rating: Math.min(doc.experience_years / 2, 5), // Convert experience to rating (max 5)
            image: doc.profile_photo,
            availability: `${doc.experience_years} years experience`,
            price: doc.session_price,
            location: {
              lat: doc.location.latitude,
              lng: doc.location.longitude,
              address: doc.clinic_address || doc.address,
            },
            reviews: [],
            about: doc.about_me || "Experienced medical professional",
          }));

        console.log("Mapped Doctors:", mappedDoctors);
        setDoctors(mappedDoctors);
        if (mappedDoctors.length > 0) {
          setSelectedDoctor(mappedDoctors[0]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const mapCenter: [number, number] = selectedDoctor
    ? [selectedDoctor.location.lat, selectedDoctor.location.lng]
    : [30.0444, 31.2357];

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography variant="h6">Loading doctors...</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen max-w-screen-1xl mx-auto shadow-2xl rounded-xl overflow-hidden">
      {/* Doctors List */}
      <Box className="lg:w-96 w-full flex-shrink-0 p-4 bg-white flex flex-col">
        <Typography variant="h6" className="font-bold mb-3">
          {doctors.length} Results
        </Typography>

        <div className="overflow-y-auto pr-2" style={{ maxHeight: "65vh" }}>
          {doctors.map((doctor) => (
            <MapCard
              key={doctor.id}
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

        <style>{`
          .leaflet-container {
            width: 100%;
            height: 100%;
            border-radius: 30px;
            z-index: 0;
          }
          .custom-doctor-marker {
            background: none;
            border: none;
          }
        `}</style>

        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {doctors.map((doctor) => {
            const isSelected = selectedDoctor?.id === doctor.id;
            return (
              <Marker
                key={doctor.id}
                position={[doctor.location.lat, doctor.location.lng]}
                icon={createDoctorMarker(doctor.image, doctor.name, isSelected)}
                eventHandlers={{
                  click: () => setSelectedDoctor(doctor),
                }}
              >
                <Popup>
                  <div className="font-sans p-2 min-w-[200px]">
                    <div className="font-bold text-base text-gray-900 mb-1">
                      {doctor.name}
                    </div>
                    <div className="text-sm text-[#145DB8] mb-2">
                      {doctor.specialty}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      ${doctor.price} / session
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {doctor.location.address}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Address Overlay */}
        {selectedDoctor && (
          <Box
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl"
            sx={{ minWidth: 260, maxWidth: "90%", zIndex: 1000 }}
          >
            <Typography
              variant="body2"
              className="font-semibold text-gray-700 text-center"
            >
              {selectedDoctor.location.address}
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default DoctorMapResults;
