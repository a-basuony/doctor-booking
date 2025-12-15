import { api } from "./api";

export interface Doctor {
  id: number;
  name: string;
  image: string;
  hospital_name: string;
  specialty_id: number;
  location: {
    lat: number;
    lng: number;
  };
  specialty: {
    id: number;
    name: string;
    icon: string | null;
    created_at: string;
    updated_at: string;
  };
  times: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    doctor_id: number;
    created_at: string;
    updated_at: string;
  }>;
  reviews: any[]; // or define a Review interface if you have structure
}

interface DoctorsNearYouResponse {
  status: boolean;
  message: string;
  data: {
    doctors_near_you: {
      current_page: number;
      data: Doctor[];
    };
  };
}
//   "/v1/home/all-near-you-doctors"
//

export const searchDoctors = {
  getDoctorsNearYou: async (
    page = 1
  ): Promise<{ doctors: Doctor[]; currentPage: number }> => {
    const res = await api.get<DoctorsNearYouResponse>(
      `/v1/home/all-near-you-doctors?page=${page}`
    );
    return {
      doctors: res.data.data.doctors_near_you.data,
      currentPage: res.data.data.doctors_near_you.current_page,
    };
  },
};
