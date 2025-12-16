import { useState } from "react";
import { ArrowLeft, Heart, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  hours: string;
  image: string;
  isFavorite: boolean;
}

const FavoriteDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      name: "Robert Johnson",
      specialty: "Orthopedic",
      hospital: "El-Nasr Hospital",
      rating: 4.8,
      hours: "9:30am - 8:00pm",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      isFavorite: true,
    },
    {
      id: 2,
      name: "Robert Johnson",
      specialty: "Orthopedic",
      hospital: "El-Nasr Hospital",
      rating: 4.8,
      hours: "9:30am - 8:00pm",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      isFavorite: true,
    },
    {
      id: 3,
      name: "Robert Johnson",
      specialty: "Orthopedic",
      hospital: "El-Nasr Hospital",
      rating: 4.8,
      hours: "9:30am - 8:00pm",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
      isFavorite: true,
    },
    {
      id: 4,
      name: "Robert Johnson",
      specialty: "Orthopedic",
      hospital: "El-Nasr Hospital",
      rating: 4.8,
      hours: "9:30am - 8:00pm",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      isFavorite: true,
    },
  ]);

  const toggleFavorite = (id: number) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === id
          ? { ...doctor, isFavorite: !doctor.isFavorite }
          : doctor
      )
    );
  };
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 bg-transparent cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Your Favorite</h2>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4"
            >
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {doctor.specialty} | {doctor.hospital}
                </p>

                {/* Rating and Hours */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold text-gray-900">
                      {doctor.rating}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{doctor.hours}</span>
                  </div>
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(doctor.id)}
                className=" bg-transparent cursor-pointer flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                aria-label="Toggle favorite"
              >
                <Heart
                  className={`w-6 h-6 ${
                    doctor.isFavorite
                      ? "text-red-500 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Empty State (optional) */}
        {doctors.filter((d) => d.isFavorite).length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600">
              Start adding doctors to your favorites!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteDoctors;
