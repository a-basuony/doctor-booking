import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService";

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: doctorService.getDoctors,
  });
}