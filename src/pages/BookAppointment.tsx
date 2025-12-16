import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "./../components/BookAppointment/FadeIn";
import { AddReviewModal } from "./../components/BookAppointment/AddReviewModal";
import { ReviewsSection } from "./../components/BookAppointment/ReviewsSection";
import { DoctorProfile } from "./../components/BookAppointment/DoctorProfile";
import { AppointmentBooking } from "./../components/BookAppointment/AppointmentBooking";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-4 md:py-8 lg:py-12 max-w-7xl mx-auto font-sans">
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      <header className="mb-8">
        <FadeIn>
          <button className="bg-transparent cursor-pointer flex items-center gap-1 text-slate-800 hover:text-blue-600 transition-colors group">
            <div
              className="p-2 rounded-full  transition-colors"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </div>
            <h1 className="text-[18px] md:text-2xl font-serif font-medium">
              Make an appointment
            </h1>
          </button>
        </FadeIn>
      </header>

      {/* <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16"> */}
      <div className="flex items-start flex-col px-3 gap-8 lg:flex-row">
        {/* Left Column: Calendar & Reviews */}
        <main className="w-full lg:w-2/3 flex-1 px-5">
          <AppointmentBooking />
          <ReviewsSection onAddReview={() => setIsReviewModalOpen(true)} />
        </main>
        {/* Right Column: Profile Sidebar */}
        <aside className=" w-full lg:w-1/3 relative px-5">
          <DoctorProfile />
        </aside>
      </div>
    </div>
  );
}
