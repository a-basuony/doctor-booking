import { FaApple } from "react-icons/fa";
import { SiGoogleplay } from "react-icons/si";

type HeroDownloadProps = {
  title?: string;
  description?: string;
  phoneImgSrc?: string;
};

export default function HeroDownload({
  title = "Your Health, One Tap Away",
  description = "Book appointments, chat with doctors, and manage your health anytime—right from your phone. Download the app now and stay connected wherever you are.",
  phoneImgSrc = "/images/iPhone 12 Pro.png",
}: HeroDownloadProps) {
  return (
    <section className="w-full relative z-10 md:-mb-40 mb-0">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">

        <div className="
          bg-[#6a98d3] 
          rounded-2xl 
          shadow-md 
          overflow-hidden
          md:flex
        ">
          
          {/* ---------- DESKTOP LAYOUT ---------- */}
          <div className="hidden md:flex w-full">
            {/* Text */}
            <div className="w-1/2 p-12 flex flex-col justify-center">
              <h1 className="text-4xl font-georgia font-normal text-white mb-2">{title}</h1>
              <p className="text-white text-base font-sans  text-[17px] leading-relaxed mb-8">{description}</p>

              <div className="flex flex-row gap-6">
                <button className="flex items-center gap-3 px-10 py-3 bg-[#05162C] text-white rounded-lg">
                  <SiGoogleplay className="w-8 h-8" />
                  <div className="text-left  ">
                    <div className="text-[16px] font-sans">Get it on</div>
                    <div className="font-georgia text-xl">Google Play</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 px-10 py-3 bg-[#05162C] text-white rounded-lg">
                  <FaApple className="w-8 h-8" />
                  <div className="text-left ">
                    <div className="text-[15px] font-sans">Download on the</div>
                    <div className="font-georgia text-[25px] ">Apple Store</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="w-1/2 p-12 flex justify-end">
              <img src={phoneImgSrc} className="w-[380px] drop-shadow-2xl" />
            </div>
          </div>


          {/* ---------- MOBILE LAYOUT ---------- */}
          <div className="md:hidden w-full flex flex-col items-center text-center px-6 py-4">

            {/* Title + Description */}
            <h1 className="text-2xl font-georgia font-normal text-white mb-4">
              {title}
            </h1>

            <p className="text-white  font-sans font-normal text-[15px] leading-relaxed mb-8">
              Book appointments, chat with doctors,<br/> and manage your health anytime—right<br/> from your phone. Download the app now <br/>and stay connected wherever you are.
            </p>

            {/* Phone Image (center + rotated) */}
            <img
              src={phoneImgSrc}
              className="
                w-72 
                drop-shadow-2xl 
                mb-8 
                transform 
                rotate-[-10deg]
              "
            />

            {/* Buttons full width stacked */}
            <div className="flex flex-col w-full gap-4">

              <button className="w-full flex items-center justify-center gap-3 py-4 bg-[#05162C] text-white rounded-xl">
                <SiGoogleplay className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-[12px] font-sans  leading-none">Get it on</div>
                  <div className="font-georgia text-xl">Google Play</div>
                </div>
              </button>

              <button className="w-full flex items-center justify-center gap-3 py-4 bg-[#05162C] text-white rounded-xl">
                <FaApple className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-[12px] font-sans leading-none">Download on the</div>
                  <div className="font-georgia text-xl">Apple Store</div>
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
