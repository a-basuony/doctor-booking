import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService";
import type { IDoctor } from "../types";

export const useDoctorDetails = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<IDoctor | undefined>({
    queryKey: ["doctor", id],
    queryFn: () => doctorService.getDoctorById(id),
    enabled: !!id,
  });

  const addReview = (newReview: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    comment: string;
    time: string;
  }) => {
    if (!query.data) return;

    queryClient.setQueryData(["doctor", id], (oldData: IDoctor | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        reviews: [...oldData.reviews, newReview],
      };
    });
  };

  return {
    doctor: query.data ?? null,
    reviews: query.data?.reviews ?? [],
    loading: query.isLoading,
    addReview,
  };
};
