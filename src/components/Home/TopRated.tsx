import { Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { api } from "../../services/api";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  hours: string;
  price: number;
  image: string;
}

export default function TopRated() {
  const navigate = useNavigate();

  const defaultDoctorsData = [
    {
      specialty: "Orthopedic",
      hospital: "El-Nasr Hospital",
      hours: "9:30am - 8:00pm",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    },
    {
      specialty: "Cardiology",
      hospital: "El-Salam Hospital",
      hours: "10:00am - 6:00pm",
      price: 400,
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    },
    {
      specialty: "Dermatology",
      hospital: "El-Nasr Hospital",
      hours: "9:00am - 7:00pm",
      price: 300,
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    },
    {
      specialty: "Pediatrics",
      hospital: "El-Noor Hospital",
      hours: "8:30am - 5:30pm",
      price: 320,
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    },
    {
      specialty: "Neurology",
      hospital: "El-Mokattam Hospital",
      hours: "9:00am - 5:00pm",
      price: 370,
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop",
    },
    {
      specialty: "Ophthalmology",
      hospital: "El-Horreya Hospital",
      hours: "10:00am - 6:30pm",
      price: 390,
      image:
        "https://images.unsplash.com/photo-1612277793672-4d2c5aa11b7b?w=400&h=400&fit=crop",
    },
  ];

  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [isMobile, setIsMobile] = React.useState<boolean>(
    window.innerWidth < 768
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    api
      .get("/reviews/doctors/avg")
      .then((res) => {
        const data = res.data.data.filter(
          (d: any) => Number(d.average_rating) > 3.5
        );
        console.log("Top Rated Doctors Data:", res.data.data);

        const mappedDoctors = data.map((d: any, index: number) => {
          // توزيع بيانات افتراضية مختلفة لكل دكتور
          const defaultFields =
            defaultDoctorsData[index % defaultDoctorsData.length];
          return {
            id: d.id,
            name: d.name,
            rating: Number(d.average_rating),
            ...defaultFields,
          };
        });

        setDoctors(mappedDoctors);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleDoctors = isMobile ? doctors.slice(0, 1) : doctors;

  const handleViewAll = () => navigate("/SearchDoctors");
  const handleBookAppointment = (doctorId: number) =>
    navigate(`/SearchDoctors?doctorId=${doctorId}`);

  if (loading)
    return (
      <div className="py-12 text-center text-gray-600">
        Loading top-rated doctors...
      </div>
    );

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-georgia font-normal text-gray-900 mb-3">
              Top-Rated Doctors Chosen by Patients
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl font-sans leading-relaxed mb-4 md:mb-0">
              Explore our highest-rated doctors, trusted by real patients for
              their expertise, care, and service. Book with confidence today.
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="hidden md:flex px-7 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-[#145db8] hover:text-white duration-500 font-sans font-normal text-xl transition leading-tight"
          >
            View All
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
          {visibleDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col sm:flex-row w-full sm:w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              {/* Image Section */}
              <div className="w-full sm:w-32 md:w-36 lg:w-40 flex-shrink-0">
                <div className="relative pt-[75%] sm:pt-0 sm:h-32 md:h-36 lg:h-40 bg-gray-200">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="absolute top-0 left-0 w-full h-full object-cover sm:relative sm:top-auto sm:left-auto sm:w-full sm:h-full"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col min-w-0">
                {/* Header */}
                <div className="mb-3">
                  <h3 className="text-lg font-georgia font-normal text-gray-900 mb-1 line-clamp-1">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 font-sans font-normal line-clamp-2">
                    {doctor.specialty} | {doctor.hospital}
                  </p>
                </div>

                {/* Rating and Hours */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-sans font-semibold text-gray-900 text-sm whitespace-nowrap">
                      {doctor.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm whitespace-nowrap">
                      {doctor.hours}
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-800 text-sm md:text-[15px] font-sans font-normal">
                      Price
                    </span>
                    <span className="text-gray-500 text-sm">/hour</span>
                  </div>
                  <span className="text-red-500 font-semibold text-sm md:text-base whitespace-nowrap">
                    ${doctor.price}
                  </span>
                </div>

                {/* Button - Spacer for flex grow */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleBookAppointment(doctor.id)}
                    className="w-full bg-[#145db8] text-white py-3 rounded-lg hover:bg-[#0f4a9c] transition-colors font-sans font-normal text-sm sm:text-base md:text-[16px]"
                  >
                    Book appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center md:hidden mt-6">
          <button
            onClick={handleViewAll}
            className="px-7 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-[#145db8] hover:text-white duration-500 font-sans font-normal text-xl transition leading-tight"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
}
