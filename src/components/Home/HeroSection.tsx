import { FaLocationDot } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { TbPointerFilled } from "react-icons/tb";
import { GiNotebook } from "react-icons/gi";
import { useNavigate } from "react-router-dom";




type HeroSectionProps = {
  title?: string;
  description?: string;
};

export default function HeroSection({
  title = "Find and book top doctors near you",
  
}: HeroSectionProps) {
    const navigate = useNavigate();

  return (
    <section className="w-full  py-20 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Upgrade Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-normal border border-blue-100">
            <BsStars className="w-4 h-4" />
            <span className=" text-slate-700 font-sans font-normal">Upgrade your account</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal font-georgia text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          
          <p className="text-[13px] md:text-sm lg:text-base text-gray-600 leading-relaxed mb-8 font-sans font-normal">
           Easily find top-rated specialists near you and book <br/>appointments in just a few clicks. Whether you<br/> need an in-person visit consultation, we're here to<br/> connect you with the right care—fast, simple, and <br/>secure.
          </p>

          {/* Patient Avatars */}
          <div className="flex items-center p-2 justify-center gap-3 mb-8 border-transparent border-gray-300 rounded-full  bg-gray-300/20">
            <div className="flex -space-x-3">
              <img
                src="/images/Ellipse_1539.png"
                alt="Patient"
                className="w-10 h-10 rounded-full border border-transparent object-cover"
               
              />
              <img
                src="/images/Ellipse_1540.png"
                alt="Patient"
                className="w-10 h-10 rounded-full border border-transparent object-cover"
                
              />
              <img
                src="/images/Ellipse_1539.jpeg"
                alt="Patient"
                className="w-10 h-10 rounded-full border border-transparent object-cover"
               
              />
            </div>
            <span className="text-xl font-georgia font-normal text-gray-500">10k+ happy patients</span>
          </div>

         {/* CTA Buttons */}
<div className="flex flex-row flex-wrap items-center justify-center gap-4">
  <button  onClick={() => navigate("/SearchDoctors")}
  className="px-6 sm:px-10 py-3 sm:py-4 bg-blue-800 text-white rounded-lg shadow-md font-sans text-[14px] sm:text-[16px] font-normal cursor-pointer">
     Get started
  </button>
  
  <button onClick={() => navigate("/SearchDoctors")}
  className="px-4 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg border border-blue-600 transition-colors flex items-center justify-center gap-2 font-sans text-[14px] sm:text-[15px] font-normal cursor-pointer">
    <GiNotebook className="w-5 sm:w-6 h-5 sm:h-6" />
    <span>Book Appointment</span>
  </button>
</div>
        </div>
       
        <div className="hidden lg:block">
          <div className="absolute left-52 top-56 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="w-16 h-16   flex items-center justify-center">
              <FaLocationDot className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-[14px] p-2 font-serif font-normal text-gray-800  border-transparent bg-slate-100  rounded-full ">Doctors near you</span>
          </div>

         
<div className="absolute right-80  flex flex-col items-center gap-2">
  <div className="text-blue-600 flex items-center justify-center transform rotate-12">
    <TbPointerFilled className="text-3xl" />
  </div>
  <span className="text-[15px] py-2 px-6 font-serif font-normal text-gray-800 border-transparent bg-slate-100 rounded-full transform rotate- ">
    Book Now
  </span>
</div>
        </div>

      </div>
    </section>
  );
}