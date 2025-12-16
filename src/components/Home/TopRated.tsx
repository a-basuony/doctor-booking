import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';

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

  const doctors: Doctor[] = [
    { id: 1, name: "Robert Johnson", specialty: "Orthopedic", hospital: "El-Nasr Hospital", rating: 4.8, hours: "9:30am - 8:00pm", price: 350, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop" },
    { id: 2, name: "Emily Clark", specialty: "Cardiology", hospital: "El-Salam Hospital", rating: 4.7, hours: "10:00am - 6:00pm", price: 400, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
    { id: 3, name: "Michael Smith", specialty: "Dermatology", hospital: "El-Nasr Hospital", rating: 4.9, hours: "9:00am - 7:00pm", price: 300, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" },
    { id: 4, name: "Sarah Lee", specialty: "Pediatrics", hospital: "El-Noor Hospital", rating: 4.8, hours: "8:30am - 5:30pm", price: 320, image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop" }
  ];

  // فقط أعلى 3
  const topDoctors = doctors.slice(0, 3);

  const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < 768);

  // تحديث حالة حجم الشاشة عند تغيير حجم النافذة
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // دكاترة مرئية حسب الشاشة
  const visibleDoctors = isMobile ? topDoctors.slice(0, 1) : topDoctors;

  const handleViewAll = () => {
    navigate('/BookingPage');
  };

  const handleBookAppointment = (doctorId: number) => {
    navigate(`/BookingPage?doctorId=${doctorId}`);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-georgia font-normal text-gray-900 mb-3">
              Top-Rated Doctors Chosen by Patients
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl font-sans leading-relaxed mb-4 md:mb-0">
              Explore our highest-rated doctors, trusted by real patients for their
              expertise, care, and service. Book with confidence today.
            </p>
          </div>
          {/* Desktop View All */}
          <button 
            onClick={handleViewAll}
            className="hidden md:flex px-7 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-[#145db8] hover:text-white duration-500 font-sans font-normal text-xl transition leading-tight"
          >
            View All
          </button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-row items-start p-4"
            >
              {/* Doctor Image */}
              <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 ml-4 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-lg font-georgia font-normal text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-gray-600 text-sm mb-1 font-sans font-normal">
                    {doctor.specialty} | {doctor.hospital}
                  </p>

                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-sans font-semibold leading-relaxed text-gray-900 text-sm">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-900 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{doctor.hours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-800 text-[15px] font-sans font-normal pr-14">Price
                      <span className='text-gray-500'>/hour</span></span>
                    <span className="text-red-500 font-semibold text-sm">${doctor.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookAppointment(doctor.id)}
                  className="mt-3 w-full bg-[#145db8] text-white py-4 rounded-lg transition-colors font-sans font-normal text-[16px]"
                >
                  Book appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile ViewAll */}
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
