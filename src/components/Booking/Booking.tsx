// import { useState, useEffect } from 'react';
// import { Calendar, ChevronDown, Clock, MapPin, User } from 'lucide-react';
// import { useMyBookings } from '../../hooks/useMyBookings';

// // Types
// interface Doctor {
//   name: string;
//   image?: string;
//   spec?: string;
//   address?: string;
// }

// interface ApiBooking {
//   id: number;
//   date: string;
//   time: string;
//   status: string;
//   doctor: Doctor;
// }

// interface Appointment {
//   id: number;
//   date: string;
//   time: string;
//   status: 'Upcoming' | 'Completed' | 'Canceled';
//   name: string;
//   image?: string;
//   specialty: string;
//   address: string;
// }

// interface DateOption {
//   value: string;
//   label: string;
// }

// // MOVE mapStatus ABOVE useEffect (FIX ERROR)
// const mapStatus = (apiStatus: string): 'Upcoming' | 'Completed' | 'Canceled' => {
//   switch(apiStatus) {
//     case 'pending_payment':
//       return 'Upcoming';
//     case 'confirmed':
//       return 'Completed';
//     case 'cancelled':
//       return 'Canceled';
//     default:
//       return 'Upcoming';
//   }
// };

// const Booking = () => {
//   const [selectedFilter, setSelectedFilter] = useState<string>('All');
//   const [selectedDate, setSelectedDate] = useState<string>('');
//   const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);

//   const { data, isLoading, error } = useMyBookings();

//   useEffect(() => {
//   if (data?.data) {
//     const run = () => {
//       const mappedAppointments: Appointment[] = data.data.map(
//         (item: ApiBooking) => ({
//           id: item.id,
//           date: item.date,
//           time: item.time.replace(":00", ""),
//           status: mapStatus(item.status),
//           name: item.doctor.name,
//           image: item.doctor.image,
//           specialty: item.doctor.spec || "General Doctor",
//           address: item.doctor.address || "No address provided",
//         })
//       );

//       setAppointments(mappedAppointments);
//     };

//     run(); // ← كده مش synchronous جوه الـ effect مباشرة
//   }
// }, [data]);

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   const filters: string[] = ['All', 'Upcoming', 'Completed', 'Canceled'];

//   const dateOptions: DateOption[] = Array.from(
//     new Set(appointments.map(a => a.date))
//   ).map(date => ({
//     value: date,
//     label: formatDate(date)
//   }));

//   const filteredAppointments = appointments.filter(apt => {
//     const matchesFilter = selectedFilter === 'All' || apt.status === selectedFilter;
//     const matchesDate = !selectedDate || apt.date === selectedDate;
//     return matchesFilter && matchesDate;
//   });

//   const handleBookAgain = (id: number) => {
//     setAppointments(prev => prev.map(apt => 
//       apt.id === id ? { ...apt, status: 'Upcoming' } : apt
//     ));
//   };

//   const handleCancel = (id: number) => {
//     setAppointments(prev => prev.map(apt => 
//       apt.id === id ? { ...apt, status: 'Canceled' } : apt
//     ));
//   };

//   const getStatusColor = (status: string): string => {
//     switch(status) {
//       case 'Upcoming': return 'text-blue-600';
//       case 'Completed': return 'text-green-600';
//       case 'Canceled': return 'text-red-600';
//       default: return 'text-gray-600';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-xl text-gray-600">Loading your appointments...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-red-600 text-6xl mb-4">⚠️</div>
//           <p className="text-xl text-red-600">Failed to load appointments</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 min-h-screen">
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h1 className="text-2xl font-bold mb-6">Your appointments</h1>
        
//         {/* Filters + Date Picker */}
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 mb-6">
//           <div className="flex gap-2 flex-wrap">
//             {filters.map(filter => (
//               <button
//                 key={filter}
//                 onClick={() => setSelectedFilter(filter)}
//                 className={`px-4 py-2 rounded-md font-medium transition-colors ${
//                   selectedFilter === filter
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {filter}
//               </button>
//             ))}
//           </div>

//           <div className="relative">
//             <button
//               onClick={() => setShowDatePicker(!showDatePicker)}
//               className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition-colors"
//             >
//               <Calendar className="w-4 h-4 text-gray-500" />
//               <span className="text-sm font-medium flex-1 text-left">
//                 {dateOptions.find(d => d.value === selectedDate)?.label || 'Select Date'}
//               </span>
//               <ChevronDown className="w-4 h-4 text-gray-500" />
//             </button>

//             {showDatePicker && (
//               <>
//                 <div 
//                   className="fixed inset-0 z-10" 
//                   onClick={() => setShowDatePicker(false)}
//                 />
//                 <div className="absolute top-full mt-2 right-0 bg-white border rounded-md shadow-lg z-20 min-w-[250px] max-h-[300px] overflow-y-auto">
//                   <button
//                     onClick={() => {
//                       setSelectedDate('');
//                       setShowDatePicker(false);
//                     }}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-500"
//                   >
//                     All Dates
//                   </button>
//                   {dateOptions.map(date => (
//                     <button
//                       key={date.value}
//                       onClick={() => {
//                         setSelectedDate(date.value);
//                         setShowDatePicker(false);
//                       }}
//                       className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm ${
//                         selectedDate === date.value ? 'bg-blue-50 text-blue-600 font-medium' : ''
//                       }`}
//                     >
//                       {date.label}
//                     </button>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Appointments */}
//         {filteredAppointments.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredAppointments.map(appointment => (
//               <div 
//                 key={appointment.id} 
//                 className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
//               >
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Calendar className="w-4 h-4" />
//                     <span>{formatDate(appointment.date)}</span>
//                   </div>
//                   <span className={`text-sm font-medium ${getStatusColor(appointment.status)}`}>
//                     {appointment.status}
//                   </span>
//                 </div>

//                 {/* Doctor */}
//                 <div className="flex items-start gap-3 mb-3">
//                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
//                     {appointment.image ? (
//                       <img 
//                         src={appointment.image} 
//                         alt={appointment.name} 
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.currentTarget.style.display = 'none';
//                           e.currentTarget.parentElement!.innerHTML = '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
//                         }}
//                       />
//                     ) : (
//                       <User className="w-6 h-6 text-blue-600" />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 truncate">{appointment.name}</h3>
//                     <p className="text-sm text-gray-600 truncate">{appointment.specialty}</p>
//                   </div>
//                 </div>

//                 {/* Time */}
//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                   <Clock className="w-4 h-4" />
//                   <span>{appointment.time}</span>
//                 </div>

//                 {/* Address */}
//                 <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
//                   <MapPin className="w-4 h-4 mt-0.5" />
//                   <span className="line-clamp-2">{appointment.address}</span>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex gap-2">
//                   {appointment.status === 'Upcoming' && (
//                     <>
//                       <button
//                         onClick={() => handleCancel(appointment.id)}
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                       >
//                         Cancel
//                       </button>
//                       <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
//                         Reschedule
//                       </button>
//                     </>
//                   )}

//                   {appointment.status === 'Completed' && (
//                     <>
//                       <button className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
//                         View Details
//                       </button>
//                       <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
//                         Feedback
//                       </button>
//                     </>
//                   )}

//                   {appointment.status === 'Canceled' && (
//                     <>
//                       <button
//                         onClick={() => handleBookAgain(appointment.id)}
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                       >
//                         Book again
//                       </button>
//                       <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
//                         Support
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 text-gray-500">
//             <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
//             <p className="text-lg">No appointments found for the selected filters</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Booking;

// ------------------------------------------------------------------------------------------------------------

import { useState } from 'react';
import { Calendar, ChevronDownIcon, Clock, MapPin, User } from 'lucide-react';

const Booking = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    window.setTimeout(() => setNotification(null), 3000);
  };
  
  const availableDates = [
    { value: '', label: 'All' },
    { value: '2024-07-21', label: 'Monday, July 21' },
    { value: '2024-07-06', label: 'Sunday, July 6' },
    { value: '2024-07-31', label: 'Wednesday, July 31' }
  ];
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2024-07-21',
      time: '11:00 AM',
      name: 'Jennifer Miller',
      specialty: 'Psychiatrist',
      address: '15161 Nasr Street, Cairo, Egypt',
      status: 'Upcoming'
    },
    {
      id: 2,
      date: '2024-07-06',
      time: '11:00 AM',
      name: 'Jennifer Miller',
      specialty: 'Psychiatrist',
      address: '15161 Nasr Street, Cairo, Egypt',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-07-31',
      time: '11:00 AM',
      name: 'Jennifer Miller',
      specialty: 'Psychiatrist',
      address: '15161 Nasr Street, Cairo, Egypt',
      status: 'Canceled'
    },
    {
      id: 4,
      date: '2024-07-21',
      time: '11:00 AM',
      name: 'Jennifer Miller',
      specialty: 'Psychiatrist',
      address: '15161 Nasr Street, Cairo, Egypt',
      status: 'Completed'
    },
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filters = ['All', 'Upcoming', 'Completed', 'Canceled'];

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = selectedFilter === 'All' || apt.status === selectedFilter;
    const matchesDate = !selectedDate || apt.date === selectedDate;
    return matchesFilter && matchesDate;
  });

  const handleReschedule = (id: number) => {
    showNotification(`Rescheduling appointment #${id}`);
  };

  const handleFeedback = (id: number) => {
    showNotification(`Opening feedback for appointment #${id}`);
  };

  const handleSupport = (id: number) => {
    showNotification(`Opening support for appointment #${id}`);
  };

  const handleViewDetails = (id: number) => {
    showNotification(`Viewing details for appointment #${id}`);
  };

  const handleBookAgain = (id: number) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'Upcoming' } : apt
    ));
  };

  const handleCancel = (id: number) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'Canceled' } : apt
    ));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Upcoming': return 'text-blue-600';
      case 'Completed': return 'text-green-600';
      case 'Canceled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {notification && (
        <div className="fixed top-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50">
          {notification}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Your appointments</h1>
        
        {/* Filter buttons and date selector */}
        <div className="flex items-center sm:justify-between justify-evenly gap-3 sm:gap-1 mb-6">
          <div className="flex gap-1 flex-wrap py-3">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center md:w-auto w-full gap-2 border rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className="sm:text-sm  text-[11px]  font-medium">
                {availableDates.find(d => d.value === selectedDate)?.label || 'Select Date'}
              </span>
              <ChevronDownIcon className="w-4 h-4 font-extrabold text-gray-500"/>
            </button>
            
            {showDatePicker && (
              <div className="absolute top-full mt-2 right-0 bg-white border rounded-md shadow-lg z-10 min-w-[200px]">
                {availableDates.map(date => (
                  <button
                    key={date.value}
                    onClick={() => {
                      setSelectedDate(date.value);
                      setShowDatePicker(false);
                    }}
                    className={`w-full text-left px-2 py-2 hover:bg-gray-100 transition-colors ${
                      selectedDate === date.value ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Appointments grid */}
        <div className="flex flex-wrap gap-4">
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="border border-gray-700 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow flex-shrink-0" style={{width: '320px'}}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              {/* Doctor info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{appointment.name}</h3>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{appointment.address}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {appointment.status === 'Upcoming' && (
                  <>
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReschedule(appointment.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Reschedule
                    </button>
                  </>
                )}
                
                {appointment.status === 'Completed' && (
                  <>
                    <button
                      onClick={() => handleViewDetails(appointment.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleFeedback(appointment.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Feedback
                    </button>
                  </>
                )}
                
                {appointment.status === 'Canceled' && (
                  <>
                    <button
                      onClick={() => handleBookAgain(appointment.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Book again
                    </button>
                    <button
                      onClick={() => handleSupport(appointment.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Support
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No appointments found for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
