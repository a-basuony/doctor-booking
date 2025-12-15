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

export interface FilterState {
  date: "today" | "tomorrow" | null;
  gender: "male" | "female" | null;
  type: "clinic" | "home" | null;
  sort: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  timeAgo: string;
  rating: number;
  text: string;
}

export interface DateSlot {
  day: string; // e.g., "Mon"
  date: number; // e.g., 15
  fullDate: Date;
}

export interface TimeSlot {
  id: string;
  time: string;
}
