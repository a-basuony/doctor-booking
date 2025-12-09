import type { IDoctor } from "../types";
import { api } from "./api";

export const DOCTORS: IDoctor[] = [
  {
    id: "1",
    name: "Dr. Robert Johnson",
    specialty: "Orthopedic",
    hospital: "El-Nasr Hospital",
    rating: 4.8,
    image: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    availability: "9:30am - 8:00pm",
    price: 350,
    location: {
      lat: 30.0594, 
      lng: 31.2725, 
      address: "129, El-Nasr Street, Nasr City, Cairo",
    },
    reviews: [
      {
        id: "r1",
        name: "Ali Hassan",
        avatar: "/user1.jpg",
        rating: 5,
        comment: "Very polite and professional.",
        time: "2 days ago",
      },
      {
        id: "r2",
        name: "Mona Adel",
        avatar: "/user2.jpg",
        rating: 4,
        comment: "Helpful and friendly doctor.",
        time: "1 week ago",
      },
    ],
    about:
      "Dr. Robert Johnson is a board-certified Orthopedic specialist with over 12 years of experience in treating musculoskeletal injuries and chronic conditions.",
  },
  {
    id: "2",
    name: "Dr. Jessica Turner",
    specialty: "Pulmonologist",
    hospital: "El-Nasr Hospital",
    rating: 4.5,
    image: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    availability: "10:00am - 6:00pm",
    price: 400,
    location: {
      lat: 30.0635, 
      lng: 31.2295, 
      address: "8, Ibn Zanki Street, Zamalek, Cairo",
    },
    reviews: [
      {
        id: "r3",
        name: "Nabila Reyna",
        avatar: "/user3.jpg",
        rating: 4.5,
        comment:
          "Excellent service! Dr. Jessica Turner was attentive and thorough. Highly recommend.",
        time: "30 min ago",
      },
      {
        id: "r4",
        name: "Ferry Ichsan A",
        avatar: "/user4.jpg",
        rating: 4.5,
        comment:
          "Quick and easy appointment! Very professional and friendly staff.",
        time: "A week ago",
      },
    ],
    about:
      "Dr. Jessica Turner specializes in pulmonology and respiratory care, helping patients maintain optimal lung health.",
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    hospital: "Cairo Medical Center",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop",
    availability: "8:00am - 4:00pm",
    price: 450,
    location: {
      lat: 30.0475, 
      lng: 31.3323, 
      address: "45, El-Teseen St, New Cairo, Egypt",
    },
    reviews: [
      {
        id: "r5",
        name: "Ahmed Ali",
        avatar: "/user5.jpg",
        rating: 5,
        comment: "Highly skilled cardiologist. Very attentive and professional.",
        time: "3 days ago",
      },
    ],
    about:
      "Dr. Michael Chen specializes in cardiology and preventive heart care, helping patients maintain optimal cardiovascular health.",
  },
  {
    id: "4",
    name: "Dr. Sarah Williams",
    specialty: "Dermatologist",
    hospital: "Nile Hospital",
    rating: 4.6,
    image: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    availability: "11:00am - 7:00pm",
    price: 320,
    location: {
      lat: 30.0090, 
      lng: 31.2030, 
      address: "78, El Haram Street, Giza, Egypt",
    },
    reviews: [
      {
        id: "r6",
        name: "Laila Omar",
        avatar: "/user6.jpg",
        rating: 4,
        comment: "Friendly and professional dermatologist.",
        time: "2 weeks ago",
      },
    ],
    about:
      "Dr. Sarah Williams provides comprehensive dermatology care including skincare consultations, treatment of skin diseases, and cosmetic procedures.",
  },
  {
    id: "5",
    name: "Dr. Ahmed Hassan",
    specialty: "Neurologist",
    hospital: "Al-Salam Hospital",
    rating: 4.8,
    image: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
    availability: "9:00am - 5:00pm",
    price: 380,
    location: {
      lat: 29.9702, 
      lng: 31.2829, 
      address: "156, Maadi Road, Cairo, Egypt",
    },
    reviews: [
      {
        id: "r7",
        name: "Hassan Ali",
        avatar: "/user7.jpg",
        rating: 5,
        comment: "Excellent neurologist, highly recommended!",
        time: "5 days ago",
      },
    ],
    about:
      "Dr. Ahmed Hassan is an experienced neurologist specializing in brain and nervous system disorders, offering advanced diagnostic and treatment options.",
  },
];

export const doctorService = {
  async getDoctors(): Promise<IDoctor[]> {
    const { data } = await api.get("/doctors");
    return data;
  },

  async getDoctorById(id: string): Promise<IDoctor | undefined> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(DOCTORS.find((d) => d.id === id)), 300)
    );
  },
};