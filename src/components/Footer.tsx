import React from 'react';
import { Link } from "react-router-dom";

import { RiFacebookFill, RiTwitterFill } from "react-icons/ri";
import { IoLogoWhatsapp, IoLogoYoutube, IoLogoLinkedin, IoLogoInstagram } from "react-icons/io";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
import { SlLocationPin } from "react-icons/sl";
import { FaPhoneVolume } from "react-icons/fa6";

interface SocialIconProps {
  Icon: React.ComponentType<{ className?: string }>;
  link: string;
  isMobile?: boolean;
}

const SocialIcon: React.FC<SocialIconProps> = ({ Icon, link, isMobile = false }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition text-2xl 
                ${isMobile ? 'bg-black/20 text-white' : 'bg-white border border-white/30'}`}
  >
    <Icon className={isMobile ? 'text-white' : 'text-gray-700'} />
  </a>
);

const Footer = () => {
  const newLocal = "text-white text-2xl  font-georgia  font-normal  mt-3";
  return (
    <footer className="bg-[#05162c] text-white pt-12 md:pt-28 pb-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Desktop Footer */}
        <div className="hidden md:flex justify-between gap-10">

          {/* Cure Section */}
          <div className="w-1/1">
            <div className="flex items-center mb-6">
              <img src="/images/BsHeartPulse.png" alt="Cure Logo" className="w-10 h-10 mr-2" />
              <span className="text-4xl font-serif">Cure</span>
            </div>

            <p className="text-gray-300 text-xl leading-relaxed mb-6 font-georgia  " >
              Cure helps you find trusted doctors,<br/>
              book appointments, and manage<br/>
              your health—quickly and easily.
            </p>

            <div className="flex gap-3 mt-4">
              <p className="w-9 h-9 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <RiFacebookFill className='text-sky-700 text-2xl' />
              </p>
              <p className="w-9 h-9 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <IoLogoWhatsapp className='text-green-600 text-2xl' />
              </p>
              <p className="w-9 h-9 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <IoLogoYoutube className='text-red-600 text-xl' />
              </p>
              <p className="w-9 h-9 rounded-lg bg-white border border-white/30 flex items-center justify-center">
                <IoLogoLinkedin className='text-blue-700 text-2xl' />
              </p>
            </div>
          </div>

          {/* Right Sections */}
          <div className="w-1/1 grid grid-cols-3 gap-5 pr-10 ">

            {/* Company */}
            <div>
              <h3 className="text-white font-georgia  font-normal text-2xl mb-4">Company</h3>
              <ul className="space-y-3 list-none font-sans font-normal">
                <li><Link to="/" className="no-underline text-white text-xl">Home</Link></li>
                <li><Link to="/doctor-details" className="no-underline text-white text-xl">Doctors</Link></li>
                <li><Link to="/FQAPage" className="no-underline text-white text-xl">FAQs</Link></li>
                <li><Link to="/contact" className="no-underline text-white text-xl">Contact Us</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white  font-georgia  font-normal text-2xl mb-4">Support</h3>
              <ul className="space-y-3 list-none">
                <li><Link to="/FQAPage" className=" font-sans font-normal no-underline text-white text-xl">Help Center</Link></li>
                <li><Link to="/FQAPage" className="no-underline text-white text-xl">How it works</Link></li>
                <li><Link to="/FQAPage" className="no-underline text-white text-xl">Privacy Policy</Link></li>
                <li><Link to="/FQAPage" className="no-underline text-white text-xl">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={newLocal}>Contact Info</h3>

              <ul className=" list-none font-sans font-normal  ">
                <li className="flex gap-3">
                  <LiaPhoneVolumeSolid className="text-xl mt-5" />
                  <div>
                    <p className="text-white text-xl leading-none">Phone</p>
                    <p className="text-gray-200 text-sm">080 707 555-321</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <TfiEmail className="text-base mt-5" />
                  <div>
                    <p className="text-white text-xl leading-none">Email</p>
                    <p className="text-gray-200 text-sm">demo@example.com</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <SlLocationPin className="text-base mt-5" />
                  <div>
                    <p className="text-white text-xl leading-none">Address</p>
                    <p className="text-gray-200 text-sm">
                      526 Melrose Street,<br/>
                      Water Mill, 11976 New York
                    </p>
                  </div>
                </li>
              </ul>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="hidden md:flex pt-3 justify-between items-center text-lg text-white    font-serif">
          <p>@2024 Techvio - All Right Reserved</p>

          <div className="flex items-center gap-3">
            <p  className="no-underline text-white">Terms & Condition</p>

            <span className="text-white text-xl">|</span>

            <p className="no-underline text-white">Privacy Policy</p>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="md:hidden bg-[#05162c] text-white pt-8 pb-4 px-4 text-center">
          
          <div className="flex mb-6 justify-start items-center">
            <img src="/images/BsHeartPulse.png" alt="Cure Logo" className="w-10 h-10" />
            <span className="text-4xl font-serif font-bold ml-2">Cure</span>
          </div>

          <h4 className="text-2xl font-serif mb-4 text-gray-100 flex items-center justify-center gap-2">
            Let's Discuss <FaPhoneVolume />
          </h4>

          <p className="text-gray-300 text-xl leading-relaxed mb-8  font-georgia">
            Cure helps you find trusted doctors,<br/>
            book appointments, and manage your health—<br/>
            quickly and easily.
          </p>

          <div className="border-t border-white/20 pt-4 flex justify-between items-center text-sm text-gray-200">
            <p className="text-[15px] font-serif">@ Cure - All rights reserved</p> 
            <div className="flex gap-2 justify-center">
              <SocialIcon Icon={RiFacebookFill} link="#" isMobile />
              <SocialIcon Icon={RiTwitterFill} link="#" isMobile />
              <SocialIcon Icon={IoLogoInstagram} link="#" isMobile />
              <SocialIcon Icon={IoLogoLinkedin} link="#" isMobile />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;