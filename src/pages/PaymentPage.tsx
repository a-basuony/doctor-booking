import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useDoctorDetails } from '../hooks/useDoctorDetails';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { usePayment } from '../hooks/usePayment';
import { AddCardModal } from '../components/payment/AddCardModal';
import { AppointmentSuccessModal } from '../components/payment/AppointmentSuccessModal';
import toast, { Toaster } from "react-hot-toast";
import { stripePromise } from '../services/paymentService';
import { authHelper } from '../utils/authHelper';


const formatCurrentDateTime = () => {
   const now = new Date();
   const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
   const date = now.toLocaleDateString('en-US', dateOptions);

   const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
   const time = now.toLocaleTimeString('en-US', timeOptions);

   return { date, time };
};

const PaymentPageContent = () => {
   const doctorId = '1' 
   const navigate = useNavigate();

   const { doctor, loading: doctorLoading } = useDoctorDetails(doctorId);
   const { paymentMethods, addPaymentMethod, isAdding, loading: cardsLoading } = usePaymentMethods();
   const { processPayment, isProcessing } = usePayment();

   const [paymentType, setPaymentType] = useState<'credit' | 'paypal' | 'apple'>('credit');
   const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
   const [showCardModal, setShowCardModal] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const { date: currentDate, time: currentTime } = formatCurrentDateTime();

   // Check authentication status on mount
   useEffect(() => {
      authHelper.logAuthStatus();
      
      if (!authHelper.isAuthenticated()) {
         console.warn('⚠️ User not authenticated - some features may not work');
         toast('Please login to use payment features (you can add token manually in console)', {
            duration: 5000,
            icon: '🔒',
         });
      }
   }, []);

   // Auto-select default card when payment methods load
   useEffect(() => {
      if (paymentMethods.length > 0 && !selectedCardId) {
         const defaultCard = paymentMethods.find(card => card.isDefault);
         setSelectedCardId(defaultCard?.id || paymentMethods[0].id);
      }
   }, [paymentMethods, selectedCardId]);

   const appointment = {
      id: '1',
      date: currentDate,
      time: currentTime,
      doctorName: doctor?.name || "Doctor Name Placeholder"
   };

   const handleAddCard = async (cardElement: any) => {
      // Check authentication first
      if (!authHelper.isAuthenticated()) {
         toast.error('Please login first to save your card. Or use: authHelper.setToken("YOUR_TOKEN") in console');
         setShowCardModal(false);
         return;
      }

      try {
         const newCard = await addPaymentMethod(cardElement);
         setSelectedCardId(newCard.id);
         setShowCardModal(false);
         toast.success("Payment card added successfully!");
      } catch (error: any) {
         console.error('Error adding card:', error);
         const errorMessage = error.message || "Failed to add payment card.";
         toast.error(errorMessage);
      }
   };

   const handlePayment = async () => {
      if (!doctor) {
         toast.error('Doctor details are missing. Cannot proceed.');
         return;
      }

      if (paymentType === 'credit' && !selectedCardId) {
         toast.error('Please select a payment card.');
         return;
      }

      const paymentPromise = (async () => {
         // Process payment using the backend API
         await processPayment({
            bookingId: appointment.id,
            paymentMethodId: paymentType === 'credit' ? selectedCardId! : undefined,
         });

         setShowSuccessModal(true);
      })();

      toast.promise(paymentPromise, {
         loading: 'Processing payment...',
         success: 'Payment successful!',
         error: (err) => err.message || 'Payment failed. Please try again.',
      });
   };

   const handleSuccessDone = () => {
      setShowSuccessModal(false);
      setTimeout(() => {
         navigate('/');
      }, 500);
   };

   if (doctorLoading || !doctor) {
      return <div className="flex items-center justify-center h-screen">Loading doctor details...</div>;
   }

   const isButtonDisabled = isProcessing || (paymentType === 'credit' && !selectedCardId);

   return (
      <div className="min-h-screen bg-neutral-50 pb-6">
         <Toaster position="top-center" reverseOrder={false} />

         <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
               <div className="px-4 py-4 flex items-center gap-3">
                  <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-lg">
                     ← Back
                  </button>
                  <h1 className="text-lg font-semibold">Payment</h1>
               </div>
            </div>

            {/* IDoctor Info */}
            <div className="p-4 space-y-4">
               <div className="bg-white rounded-2xl p-4 shadow-sm border">
                  <div className="flex gap-3">
                     <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-xl object-cover"
                     />
                     <div className="flex-1">
                        <h2 className="font-semibold">{doctor.name}</h2>
                        <p className="text-sm text-secondary-600">{doctor.specialty}</p>
                        <p className="text-xs text-secondary-500 mt-1">{doctor.location.address}</p>
                     </div>
                  </div>
               </div>

               <div className="bg-primary-50 rounded-xl p-4 flex items-center justify-between border border-primary-100">
                  <span className="font-medium text-sm">
                     {appointment.date} - {appointment.time}
                  </span>
                  <button className="text-primary-600 text-sm font-medium">
                     Reschedule
                  </button>
               </div>

               <div className="bg-white rounded-2xl p-4 shadow-sm border">
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="space-y-3 mb-4">
                     {['credit', 'paypal', 'apple'].map((type) => (
                        <button
                           key={type}
                           onClick={() => setPaymentType(type as any)}
                           className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${paymentType === type ? 'border-success-500 bg-secondary-50' : 'border-secondary-200'
                              }`}
                        >
                           <span className="font-medium capitalize">{type}</span>
                           {paymentType === type && <span>✓</span>}
                        </button>
                     ))}
                  </div>
                  {paymentType === 'credit' && (
                     <>
                        {cardsLoading && (
                           <div className="mb-3 p-4 text-center text-secondary-500">
                              Loading saved cards...
                           </div>
                        )}
                        {!cardsLoading && paymentMethods.length > 0 && (
                           <div className="mb-3 space-y-2">
                              {paymentMethods.map((card) => (
                                 <button
                                    key={card.id}
                                    onClick={() => setSelectedCardId(card.id)}
                                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${selectedCardId === card.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'
                                       }`}
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="w-12 h-8 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                          {card.brand}
                                       </div>
                                       <div className="text-left">
                                          <p className="font-medium">•••• {card.last4}</p>
                                          <p className="text-xs text-secondary-500">
                                             {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                                          </p>
                                       </div>
                                    </div>
                                 </button>
                              ))}
                           </div>
                        )}
                        {!cardsLoading && paymentMethods.length === 0 && (
                           <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                              <p className="text-sm text-blue-700">
                                 No saved cards yet. Add a new card to continue.
                              </p>
                           </div>
                        )}
                        <button
                           onClick={() => setShowCardModal(true)}
                           className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-600 font-medium"
                        >
                           + Add new card
                        </button>
                     </>
                  )}
               </div>

               <div className="bg-white rounded-2xl p-4 shadow-sm border">
                  <div className="flex items-center justify-between mb-6 py-4 border-t">
                     <span className="text-secondary-600">Total Price</span>
                     <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-red-500">{doctor.price}$</span>
                        <span className="text-sm text-secondary-500">/hour</span>
                     </div>
                  </div>

                  <button
                     onClick={handlePayment}
                     disabled={isButtonDisabled}
                     className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-4 rounded-xl font-semibold text-lg"
                  >
                     {isProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
               </div>
            </div>
         </div>

         {/* Add Card Modal */}
         {showCardModal && (
            <AddCardModal
               onSuccess={handleAddCard}
               onCancel={() => setShowCardModal(false)}
               isLoading={isAdding}
            />
         )}

         {showSuccessModal && (
            <AppointmentSuccessModal
               doctorName={doctor.name}
               date={appointment.date}
               time={appointment.time}
               onDone={handleSuccessDone}
            />
         )}
      </div>
   );
};

// Main component wrapped with Stripe Elements
export const PaymentPage = () => {
   return (
      <Elements stripe={stripePromise}>
         <PaymentPageContent />
      </Elements>
   );
};