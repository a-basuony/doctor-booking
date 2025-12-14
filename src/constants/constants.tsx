// import { Doctor, Specialty } from "./types";

// import { Doctor, Specialty } from "../types/appointment";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  timeStart: string;
  timeEnd: string;
  price: number;
  image: string;
}

export interface Specialty {
  id: string;
  name: string;
  icon: string; // Basic string identifier for icon mapping
}

import {
  Stethoscope,
  Heart,
  Ear,
  Brain,
  Activity,
  Eye,
  Bone,
} from "lucide-react";

export const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Robert Johnson",
    specialty: "Orthopedic",
    hospital: "El-Nasr Hospital",
    rating: 4.8,
    timeStart: "9:30am",
    timeEnd: "8:00pm",
    price: 350,
    image: "https://picsum.photos/id/1012/200/200",
  },
  {
    id: "2",
    name: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    hospital: "City Heart Center",
    rating: 4.9,
    timeStart: "10:00am",
    timeEnd: "6:00pm",
    price: 450,
    image: "https://picsum.photos/id/1027/200/200",
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    hospital: "General Hospital",
    rating: 4.7,
    timeStart: "8:00am",
    timeEnd: "4:00pm",
    price: 400,
    image: "https://picsum.photos/id/1005/200/200",
  },
  {
    id: "4",
    name: "Dr. Emily Davis",
    specialty: "General Practitioner",
    hospital: "Family Clinic",
    rating: 4.9,
    timeStart: "9:00am",
    timeEnd: "5:00pm",
    price: 200,
    image: "https://picsum.photos/id/338/200/200",
  },
  {
    id: "5",
    name: "Dr. William Wilson",
    specialty: "Dentist",
    hospital: "Smile Care",
    rating: 4.6,
    timeStart: "11:00am",
    timeEnd: "7:00pm",
    price: 150,
    image: "https://picsum.photos/id/64/200/200",
  },
  {
    id: "6",
    name: "Dr. Linda Taylor",
    specialty: "Ophthalmologist",
    hospital: "Vision Center",
    rating: 4.8,
    timeStart: "9:30am",
    timeEnd: "5:30pm",
    price: 300,
    image: "https://picsum.photos/id/342/200/200",
  },
  {
    id: "7",
    name: "Dr. David Anderson",
    specialty: "Orthopedic",
    hospital: "Sports Med Clinic",
    rating: 4.7,
    timeStart: "8:30am",
    timeEnd: "4:30pm",
    price: 380,
    image: "https://picsum.photos/id/237/200/200",
  },
  {
    id: "8",
    name: "Dr. Jennifer Martinez",
    specialty: "Pediatrician",
    hospital: "Childrens Hospital",
    rating: 5.0,
    timeStart: "9:00am",
    timeEnd: "3:00pm",
    price: 250,
    image: "https://picsum.photos/id/399/200/200",
  },
  {
    id: "9",
    name: "Dr. James White",
    specialty: "Dermatologist",
    hospital: "Skin Care Institute",
    rating: 4.8,
    timeStart: "10:30am",
    timeEnd: "6:30pm",
    price: 320,
    image: "https://picsum.photos/id/177/200/200",
  },
];

export const SPECIALTIES: Specialty[] = [
  { id: "1", name: "Dentist", icon: "tooth" },
  { id: "2", name: "Cardiologist", icon: "heart" },
  { id: "3", name: "ENT", icon: "ear" },
  { id: "4", name: "Neurologist", icon: "brain" },
  { id: "5", name: "General Practitioner", icon: "stethoscope" },
  { id: "6", name: "Ophthalmologist", icon: "eye" },
  { id: "7", name: "Orthopedic", icon: "bone" },
];

export const ICON_MAP: Record<string, any> = {
  tooth: Stethoscope, // Using generic fallback/approx for demo if specific icon missing in set
  heart: Heart,
  ear: Ear,
  brain: Brain,
  stethoscope: Activity,
  eye: Eye,
  bone: Bone,
};
