import React from 'react';
import { RiFacebookFill, RiTwitterFill } from "react-icons/ri"; 
import { IoLogoWhatsapp, IoLogoYoutube,IoLogoLinkedin, IoLogoInstagram } from "react-icons/io";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
import { SlLocationPin } from "react-icons/sl";
import heartLogo from "../../public/imgs/BsHeartPulse.png";
import { FaPhoneVolume } from "react-icons/fa6";


const SocialIcon: React.FC<{ Icon: React.ElementType, link: string, isMobile?: boolean }> = ({ Icon, link, isMobile = false }) => (
    <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition text-2xl 
                    ${isMobile 
                        ? 'bg-black/20 text-white' 
                        : 'bg-white border border-white/30'
                    }`}
    >
        <Icon className={
            isMobile 
            ? 'text-white' 
            : 'text-gray-700'
        } />
    </a>
);

const Footer: React.FC = () => {
 return (
 <footer className="bg-[#05162c] text-white pt-12 md:pt-28 pb-10 px-6">
<div className="max-w-7xl mx-auto">
        
       
{/* Desktop Footer */}
<div className="hidden md:flex justify-between gap-10 ">

    {/* Cure Section (unchanged) */}
    <div className="w-1/1">
        <div className="flex items-center mb-6">
            <img src={heartLogo} alt="Cure Logo" className="w-12 h-12 mr-2" />
            <span className="text-4xl font-serif">Cure</span>
        </div>

        <p className="text-gray-300 text-xl leading-relaxed mb-6 font-serif">
            Cure helps you find trusted doctors,<br/> book appointments,
            and manage <br/>your health—quickly and easily.
        </p>

        <div className="flex gap-5  ">
            <p className="w-10 h-10 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <RiFacebookFill className='text-sky-700 text-2xl ' />
            </p>
            <p className="w-10 h-10 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <IoLogoWhatsapp className='text-green-600 text-2xl' />
            </p>
            <p className="w-10 h-10 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <IoLogoYoutube className='text-red-500 text-xl' />
            </p>
            <p className="w-10 h-10 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <IoLogoLinkedin className='text-blue-700 text-2xl' />
            </p>
        </div>
    </div>

    {/* RIGHT SECTIONS shifted right */}
    <div className="w-1/1 grid grid-cols-3 gap-5 pr-10">

        {/* Company */}
        <div>
<h3
  className="text-white text-2xl font-normal leading-none mb-4"
  style={{ fontFamily: "Georgia" }}
>
  Company
</h3>
            <ul className="space-y-3 list-none text-lg  ">
                <li><a href="/" className="text-white text-xl no-underline ">Home</a></li>
                <li><a href="/" className="text-white text-xl  no-underline">Doctors</a></li>
                <li><a href="/" className="text-white text-xl no-underline">FAQs</a></li>
                <li><a href="/" className="text-white text-xl no-underline">Contact Us</a></li>
            </ul>
        </div>

        {/* Support */}
        <div >
            <h3 className="text-white  text-2xl mb-4 font-normal leading-none " style={{ fontFamily: "Georgia" }}>Support</h3>
            <ul className="space-y-3 list-none text-lg  "> 
                <li><a href="#" className="text-white  no-underline">Help Center</a></li>
                <li><a href="#" className="text-white  no-underline">How it works</a></li>
                <li><a href="#" className="text-white  no-underline">Privacy Policy</a></li>
                <li><a href="#" className="text-white  no-underline">Terms & Conditions</a></li>
            </ul>
        </div>

        {/* Contact Info */}
       <div>
    <h3 className="text-white text-2xl  mb-4 font-normal leading-none" style={{ fontFamily: "Georgia" }}>Contact Info</h3>
    <ul className="space-y-6 list-none text-lg">

        <li className="flex items-start gap-3">
            <LiaPhoneVolumeSolid className='text-xl mt-1' />
            <div className="leading-tight"> 
                <p className="text-white text-xl m-0 p-0">Phone</p>
                <p className="text-gray-200 text-sm m-0 p-0">080 707 555-321</p>
            </div>
        </li>

        <li className="flex items-start gap-3">
            <TfiEmail className='text-base mt-1' />
            <div className="leading-tight">
                <p className="text-white text-xl m-0 p-0">Email</p>
                <p className="text-gray-200 text-sm m-0 p-0">demo@example.com</p>
            </div>
        </li>

        <li className="flex items-start gap-3">
            <SlLocationPin className='text-base mt-1' />
            <div className="leading-tight">
                <p className="text-white text-xl m-0 p-0">Address</p>
                <p className="text-gray-200 text-sm m-0 p-0">
                    526 Melrose Street,<br />
                    Water Mill, 11976 New York
                </p>
            </div>
        </li>

    </ul>
</div>

    </div>
</div>


{/* Bottom Bar */}
<div className="hidden md:flex mt-14 pt-6 justify-between items-center text-lg text-white border-t border-white/20 font-serif " style={{ fontFamily: "Georgia" }}>
    <p>@2024 Techvio - All Right Reserved</p>

    <div className="flex items-center gap-3">
        <p>Terms & Condition</p>

      
        <span className="text-white text-xl">|</span>

        <p>Privacy Policy</p>
    </div>
</div>


        
        {/* محتوى الهاتف (Mobile)  */}
       
        <div className="md:hidden bg-[#05162c] text-white pt-8 pb-4 px-4 text-center">
            
            {/* اللوجو */}
            <div className="flex  mb-6">
                <img src={heartLogo} alt="Cure Logo" className="w-10 h-10 mr-2" />
                <span className="text-4xl font-serif font-bold">Cure</span>
            </div>
            
            {/* العنوان */}
            <h4 className=" font-normal leading-none text-2xl  mb-4  text-gray-100 flex items-center justify-center " style={{ fontFamily: "Georgia" }}>Let's Discuss <FaPhoneVolume />
</h4>
            
           
            <p className="text-gray-300  text-[25px]  font-normal  leading-relaxed mb-8 mx-auto font-serif">
         Cure helps you find trusted doctors,book <br/>
        
                 appointments, and manage your health—<br/>
                quickly and easily.
            </p>
<hr className="border border-white mb-4" />
            <div className="border-t border-white/20 pt-4 flex justify-between items-center text-sm text-gray-200" >
                <p className=' text-[20px]  'style={{ fontFamily: "Georgia" }}>@ Cure - All rights reserved</p> 
                
                {/* الأيقونات */}
                <div className="flex gap-2">
                    <SocialIcon Icon={RiFacebookFill} link='#' isMobile={true} />
                    <SocialIcon Icon={RiTwitterFill} link='#' isMobile={true} />
                                         <SocialIcon Icon={IoLogoInstagram} link='#' isMobile={true} />
                    <SocialIcon Icon={IoLogoLinkedin} link='#' isMobile={true} />

                </div>
            </div>
        </div>
        
</div>

</footer>
);
};

export default Footer;