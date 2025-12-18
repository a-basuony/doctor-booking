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
  gender: "male" | "female";
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
}
