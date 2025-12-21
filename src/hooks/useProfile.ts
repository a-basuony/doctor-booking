import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProfileData } from "../types/auth";
import { profileService } from "../services/profileService";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/utils.";
import { TOAST_DURATION } from "../constants";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => profileService.updateProfile(data),
    onSuccess: (response) => {
      console.log("Update profile response:", response);

      // Update the cache with the new user data from the response
      queryClient.setQueryData(["currentUser"], response.data);

      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success("Personal information updated successfully!");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message, { duration: TOAST_DURATION });
    },
  });
};
