import { ArrowLeft, Heart, Clock, Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";

const FavoriteDoctors = () => {
  const navigate = useNavigate();
  const { data: favoriteDoctors, isLoading, error } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleToggleFavorite = (doctorId: number) => {
    toggleFavorite.mutate(doctorId);
  };

  const handleDoctorClick = (doctorId: number) => {
    navigate(`/SearchDoctors/${doctorId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">
              Failed to load favorites. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasFavorites = favoriteDoctors && favoriteDoctors.length > 0;

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
        {hasFavorites ? (
          <div className="space-y-4">
            {favoriteDoctors.map((doctor) => {
              const profilePhoto = doctor.profile_photo
                ? `https://round8-backend-team-one.huma-volve.com/storage/${doctor.profile_photo}`
                : null;

              return (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4"
                >
                  {/* Doctor Image */}
                  <div
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => handleDoctorClick(doctor.id)}
                  >
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt={doctor.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-blue-100 flex items-center justify-center">
                                <span class="text-2xl font-semibold text-blue-600">${doctor.name.charAt(
                                  0
                                )}</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-blue-600">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleDoctorClick(doctor.id)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 truncate">
                      {doctor.specialty.name}
                    </p>

                    {/* Location and Price */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {doctor.clinic_address}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-blue-600">
                          ${doctor.session_price}
                        </span>
                        <span className="text-gray-500 ml-1">/session</span>
                      </div>
                    </div>

                    {/* Experience */}
                    {doctor.experience_years > 0 && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{doctor.experience_years} years experience</span>
                      </div>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(doctor.id)}
                    disabled={toggleFavorite.isPending}
                    className="bg-transparent cursor-pointer flex-shrink-0 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        doctor.is_favorite
                          ? "text-red-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding doctors to your favorites!
              </p>
              <button
                onClick={() => navigate("/SearchDoctors")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Find Doctors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteDoctors;
