import { useQuery } from "@tanstack/react-query";
import { searchDoctors } from "../services/searchDoctors";

export const useDoctorsNearYou = (page: number) => {
  return useQuery({
    queryKey: ["doctors-near-you", page],
    queryFn: () => searchDoctors.getDoctorsNearYou(page),
    staleTime: 1000 * 60 * 5,
  });
};
