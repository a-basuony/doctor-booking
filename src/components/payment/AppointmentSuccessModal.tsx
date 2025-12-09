import { useEffect } from 'react';

interface AppointmentSuccessModalProps {
   doctorName: string;
   date: string;
   time: string;
   onDone: () => void; //
}

export const AppointmentSuccessModal = ({
   doctorName,
   date,
   time,
   onDone
}: AppointmentSuccessModalProps) => {

   useEffect(() => {
      const timer = setTimeout(() => {
         onDone();
      }, 5000); 

      return () => clearTimeout(timer);
   }, [onDone]); 

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-[32px] shadow-2xl p-8 max-w-sm w-full text-center">

            <div className="mx-auto w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-6">
               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
               Congratulations!
            </h2>

            <p className="text-md text-gray-600 mb-8">
               Your appointment with <span className="font-semibold">{doctorName}</span> is confirmed for <span className="font-semibold">{date}</span>, at <span className="font-semibold">{time}</span>.
            </p>

            <button
               onClick={onDone}
               className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg transition duration-150"
            >
               Done
            </button>

            <button
               onClick={onDone}
               className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
               Edit your appointment
            </button>

            <p className="text-xs text-gray-400 mt-2">
               (Auto-redirecting in 2 seconds)
            </p>

         </div>
      </div>
   );
};