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
