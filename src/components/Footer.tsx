import React from "react";
import { RiFacebookFill, RiTwitterFill } from "react-icons/ri";
import {
  IoLogoWhatsapp,
  IoLogoYoutube,
  IoLogoLinkedin,
  IoLogoInstagram,
} from "react-icons/io";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
import { SlLocationPin } from "react-icons/sl";
import { FaPhoneVolume } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SocialIcon: React.FC<{
  Icon: React.ElementType;
  link: string;
  isMobile?: boolean;
  colorClass?: string;
}> = ({ Icon, link, isMobile = false, colorClass }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition text-2xl 
                bg-white border border-white/30`}
  >
    <Icon
      className={colorClass || (isMobile ? "text-white" : "text-blue-600")}
    />
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05162c] text-white pt-12 md:pt-28 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-24">
          <div>
            <div className="flex items-center mb-4 gap-2">
              <img
                src={"/imgs/heart-logo.png"}
                alt="Cure Logo"
                className="mr-2"
              />
              <span className="text-4xl font-serif">Cure</span>
            </div>
            <p className="text-gray-300 text-xl leading-relaxed mb-6">
              Cure helps you find trusted doctors, book appointments, and manage
              your health—quickly and easily.
            </p>
            <div className="flex gap-3">
              <SocialIcon
                Icon={RiFacebookFill}
                link="#"
                colorClass="text-blue-600"
              />
              <SocialIcon
                Icon={RiTwitterFill}
                link="#"
                colorClass="text-sky-500"
              />
              <SocialIcon
                Icon={IoLogoWhatsapp}
                link="#"
                colorClass="text-green-500"
              />
              <SocialIcon
                Icon={IoLogoYoutube}
                link="#"
                colorClass="text-red-500"
              />
              <SocialIcon
                Icon={IoLogoLinkedin}
                link="#"
                colorClass="text-blue-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Company */}
            <div>
              <h3 className="text-white font-serif text-2xl mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-white text-xl">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/doctor-details" className="text-white text-xl">
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link to="/FQAPage" className="text-white text-xl">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white text-xl">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-serif text-2xl mb-4">Support</h3>
              <ul className="space-y-3 font-sans">
                <li>
                  <Link to="/contact" className="text-white text-xl">
                    Help Center
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-white text-xl">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-xl">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-xl">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white text-2xl font-serif mb-4">
                Contact Info
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <LiaPhoneVolumeSolid className="text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-xl mb-1">Phone</p>
                    <p className="text-gray-200 text-sm">0120 707 555 321</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TfiEmail className="text-base mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-xl mb-1">Email</p>
                    <p className="text-gray-200 text-sm">demo@examples.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <SlLocationPin className="text-base mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-xl mb-1">Address</p>
                    <p className="text-gray-200 text-sm">
                      532 Merense Street,
                      <br />
                      Malad Mill, 1205 New York
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Bar */}
        <div className="hidden md:flex mt-10 pt-6 justify-between items-center text-xl font-serif text-white border-t border-white/20">
          <p>@2024 TechXic. All Right Reserved</p>
          <div className="flex gap-4">
            <p>Terms & Condition</p>
            <span>|</span>
            <p>Privacy Policy</p>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden bg-[#05162c] text-white pt-8 pb-4 px-4 text-center">
          <div className="flex mb-6 justify-center items-center">
            <img
              src={"/imgs/heart-logo.png"}
              alt="Cure Logo"
              className="w-10 h-10 mr-2"
            />
            <span className="text-4xl font-serif font-bold">Cure</span>
          </div>

          <h4 className="text-2xl font-serif mb-4 text-gray-100 flex items-center justify-center gap-2">
            Let's Discuss <FaPhoneVolume />
          </h4>

          <p className="text-gray-300 text-lg leading-relaxed mb-8 mx-auto max-w-xs font-serif">
            Cure helps you find trusted doctors, <br />
            book appointments, and manage your health—
            <br />
            quickly and easily.
          </p>

          <div className="border-t border-white/20 pt-4 flex justify-between items-center text-sm text-gray-200">
            <p className="text-[15px] font-serif">
              @ Cure - All rights reserved
            </p>
            <div className="flex gap-2 justify-center">
              <SocialIcon
                Icon={RiFacebookFill}
                link="#"
                isMobile
                colorClass="text-blue-600"
              />
              <SocialIcon
                Icon={RiTwitterFill}
                link="#"
                isMobile
                colorClass="text-sky-500"
              />
              <SocialIcon
                Icon={IoLogoInstagram}
                link="#"
                isMobile
                colorClass="text-pink-600"
              />
              <SocialIcon
                Icon={IoLogoLinkedin}
                link="#"
                isMobile
                colorClass="text-blue-700"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
