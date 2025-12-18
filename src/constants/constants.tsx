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
  gender: "male" | "female"; // Add this
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
    gender: "male", // Added
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
    gender: "female", // Added
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
    gender: "male", // Added
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
    gender: "female", // Added
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
    gender: "male", // Added
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
    gender: "female", // Added
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
    gender: "male", // Added
  },
  {
    id: "8",
    name: "Dr. Jennifer Martinez",
    specialty: "Pediatrician",
    hospital: "Children's Hospital",
    rating: 5.0,
    timeStart: "9:00am",
    timeEnd: "3:00pm",
    price: 250,
    image: "https://picsum.photos/id/399/200/200",
    gender: "female", // Added
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
    gender: "male", // Added
  },
  {
    id: "10",
    name: "Dr. Olivia Brown",
    specialty: "Cardiologist",
    hospital: "Heart Plus Clinic",
    rating: 4.6,
    timeStart: "8:00am",
    timeEnd: "2:00pm",
    price: 420,
    image: "https://picsum.photos/id/433/200/200",
    gender: "female", // Added
  },
  {
    id: "11",
    name: "Dr. Daniel Harris",
    specialty: "ENT",
    hospital: "Hearing Care Center",
    rating: 4.5,
    timeStart: "10:00am",
    timeEnd: "5:00pm",
    price: 260,
    image: "https://picsum.photos/id/1025/200/200",
    gender: "male", // Added
  },
  {
    id: "12",
    name: "Dr. Sophia Clark",
    specialty: "Neurologist",
    hospital: "Brain Health Clinic",
    rating: 4.9,
    timeStart: "9:00am",
    timeEnd: "4:00pm",
    price: 480,
    image: "https://picsum.photos/id/823/200/200",
    gender: "female", // Added
  },
  {
    id: "13",
    name: "Dr. Matthew Lewis",
    specialty: "Dentist",
    hospital: "Bright Smile Center",
    rating: 4.7,
    timeStart: "11:00am",
    timeEnd: "6:00pm",
    price: 180,
    image: "https://picsum.photos/id/91/200/200",
    gender: "male", // Added
  },
  {
    id: "14",
    name: "Dr. Ava Walker",
    specialty: "Dermatologist",
    hospital: "Derma Plus",
    rating: 4.8,
    timeStart: "9:30am",
    timeEnd: "5:30pm",
    price: 340,
    image: "https://picsum.photos/id/823/200/200",
    gender: "female", // Added
  },
  {
    id: "15",
    name: "Dr. Christopher Hall",
    specialty: "Orthopedic",
    hospital: "Bone & Joint Center",
    rating: 4.6,
    timeStart: "8:00am",
    timeEnd: "3:00pm",
    price: 390,
    image: "https://picsum.photos/id/65/200/200",
    gender: "male", // Added
  },
  {
    id: "16",
    name: "Dr. Isabella Young",
    specialty: "Ophthalmologist",
    hospital: "Eye Care Clinic",
    rating: 4.9,
    timeStart: "10:00am",
    timeEnd: "6:00pm",
    price: 310,
    image: "https://picsum.photos/id/550/200/200",
    gender: "female", // Added
  },
  {
    id: "17",
    name: "Dr. Andrew King",
    specialty: "General Practitioner",
    hospital: "Downtown Medical Center",
    rating: 4.4,
    timeStart: "9:00am",
    timeEnd: "5:00pm",
    price: 190,
    image: "https://picsum.photos/id/100/200/200",
    gender: "male", // Added
  },
  {
    id: "18",
    name: "Dr. Mia Scott",
    specialty: "Pediatrician",
    hospital: "Kids Health Clinic",
    rating: 5.0,
    timeStart: "8:30am",
    timeEnd: "2:30pm",
    price: 270,
    image: "https://picsum.photos/id/823/200/200",
    gender: "female", // Added
  },
  {
    id: "19",
    name: "Dr. Joseph Green",
    specialty: "ENT",
    hospital: "ENT Care Center",
    rating: 4.6,
    timeStart: "10:00am",
    timeEnd: "4:00pm",
    price: 240,
    image: "https://picsum.photos/id/77/200/200",
    gender: "male", // Added
  },
  {
    id: "20",
    name: "Dr. Charlotte Adams",
    specialty: "Dermatologist",
    hospital: "Clear Skin Clinic",
    rating: 4.9,
    timeStart: "11:00am",
    timeEnd: "7:00pm",
    price: 360,
    image: "https://picsum.photos/id/823/200/200",
    gender: "female", // Added
  },
  {
    id: "21",
    name: "Dr. Ryan Baker",
    specialty: "Cardiologist",
    hospital: "Advanced Heart Care",
    rating: 4.7,
    timeStart: "9:00am",
    timeEnd: "5:00pm",
    price: 440,
    image: "https://picsum.photos/id/888/200/200",
    gender: "male", // Added
  },
  {
    id: "22",
    name: "Dr. Natalie Perez",
    specialty: "General Practitioner",
    hospital: "Community Health Center",
    rating: 4.8,
    timeStart: "8:00am",
    timeEnd: "4:00pm",
    price: 210,
    image: "https://picsum.photos/id/823/200/200",
    gender: "female", // Added
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

export type { Doctor };
