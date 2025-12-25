import { FiSearch } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";


// Custom icon for red location pin
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const createDoctorIcon = (imageUrl: string) => {
  return L.divIcon({
    className: 'custom-doctor-marker',
    html: `
      <img 
        src="${imageUrl}" 
        style="width:95px; height:95px; object-fit:cover; z-index:10000;" 
      />
    `,
  });
};

export default function FindCareMap() {
  
  const navigate = useNavigate();

  const centerPosition: [number, number] = [44.9778, -93.265];

  const doctors = [
    { id: 1, position: [44.9878, -93.255] as [number, number], img: "/images/img Map/Location Image (1).png", name: "Dr. Smith" },
    { id: 2, position: [44.9728, -93.275] as [number, number], img: "/images/img Map/Location Image (2).png", name: "Dr. Johnson" },
    { id: 3, position: [44.9678, -93.245] as [number, number], img: "/images/img Map/Location Image.png", name: "Dr. Williams" },
  ];

  

  return (
    <section className="w-full  pt-10  ">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">

          {/* TEXT = order-1 on mobile */}
          <div className="space-y-6 order-1 lg:order-none text-center lg:text-left">
            <h1 className="text-2xl font-serif font-normal text-gray-900 leading-tight">
              Find Care Near Youin Seconds
            </h1>

            <p className="text-[15px] md:text-sm lg:text-base text-[#6D7379] leading-relaxed font-sans max-w-lg mx-auto lg:mx-0">
              Allow location access or choose your city to<br />
              instantly discover trusted doctors and clinics<br />
              around you—quick, easy, and local.
            </p>
          </div>

          {/* MAP = order-3 on mobile */}
          <div className="relative w-full h-[350px] md:h-[500px] order-3 lg:order-none">
            <style>{`
              .leaflet-container {
                width: 100%;
                height: 100%;
                border-radius: 24px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
              }
              .custom-doctor-marker {
                background: none;
                border: none;
              }
            `}</style>

            <MapContainer
              center={centerPosition}
              zoom={13}
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={centerPosition} icon={redIcon}>
                <Popup>
                  <div className="text-center font-sans"><strong>Walker Art Center</strong></div>
                </Popup>
              </Marker>

              {doctors.map((doctor) => (
                <Marker key={doctor.id} position={doctor.position} icon={createDoctorIcon(doctor.img)}>
                  <Popup>
                    <div className="text-center font-sans font-normal leading-relaxed ">
                      <strong>{doctor.name}</strong><br />
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* BUTTON = order-4 on mobile (AFTER MAP) */}
          <div className="order-4 lg:order-none text-center  lg:text-left     ">
            <button
          onClick={() => navigate("/SearchDoctors")}
              className="group flex items-center justify-center lg:justify-start gap-3 px-6 py-3 bg-white border border-[#145DB8] rounded-xl 
                          md:w-auto hover:bg-[#145DB8] transition duration-500 lg:mt-[-85px] "
            >
              <FiSearch className="w-5 h-5 text-[#145DB8] group-hover:text-white transition" />
              <span className="text-[#145DB8] group-hover:text-white text-base ">
                Search by location
              </span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}