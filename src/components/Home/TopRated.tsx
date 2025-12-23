import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { api } from '../../services/api';

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

  // مصفوفة بيانات ثابتة متنوعة لكل دكتور
  const defaultDoctorsData = [
    {
      specialty: "Orthopedic",
      hospital: "El-Nasr Hospital",
      hours: "9:30am - 8:00pm",
      price: 350,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
    },
    {
      specialty: "Cardiology",
      hospital: "El-Salam Hospital",
      hours: "10:00am - 6:00pm",
      price: 400,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
    },
    {
      specialty: "Dermatology",
      hospital: "El-Nasr Hospital",
      hours: "9:00am - 7:00pm",
      price: 300,
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop"
    },
    {
      specialty: "Pediatrics",
      hospital: "El-Noor Hospital",
      hours: "8:30am - 5:30pm",
      price: 320,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop"
    },
    {
      specialty: "Neurology",
      hospital: "El-Mokattam Hospital",
      hours: "9:00am - 5:00pm",
      price: 370,
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop"
    },
    {
      specialty: "Ophthalmology",
      hospital: "El-Horreya Hospital",
      hours: "10:00am - 6:30pm",
      price: 390,
      image: "https://images.unsplash.com/photo-1612277793672-4d2c5aa11b7b?w=400&h=400&fit=crop"
    }
  ];

  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < 768);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    api.get('/reviews/doctors/avg')
      .then(res => {
        const data = res.data.data.filter((d: any) => Number(d.average_rating) > 3.5);
        console.log("Top Rated Doctors Data:", res.data.data);

        const mappedDoctors = data.map((d: any, index: number) => {
          // توزيع بيانات افتراضية مختلفة لكل دكتور
          const defaultFields = defaultDoctorsData[index % defaultDoctorsData.length];
          return {
            id: d.id,
            name: d.name,
            rating: Number(d.average_rating),
            ...defaultFields
          };
        });

        setDoctors(mappedDoctors);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleDoctors = isMobile ? doctors.slice(0, 1) : doctors;

  const handleViewAll = () => navigate('/SearchDoctors');
  const handleBookAppointment = (doctorId: number) => navigate(`/SearchDoctors?doctorId=${doctorId}`);

  if (loading) return <div className="py-12 text-center text-gray-600">Loading top-rated doctors...</div>;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-georgia font-normal text-gray-900 mb-3">
              Top-Rated Doctors Chosen by Patients
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl font-sans leading-relaxed mb-4 md:mb-0">
              Explore our highest-rated doctors, trusted by real patients for their expertise, care, and service. Book with confidence today.
            </p>
          </div>
          <button 
            onClick={handleViewAll}
            className="hidden md:flex px-7 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-[#145db8] hover:text-white duration-500 font-sans font-normal text-xl transition leading-tight"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-row items-start p-4"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
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
 