import { useMutation } from "@tanstack/react-query";
import type { User } from "../types/auth";
import { profileService } from "../services/profileService";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/utils.";
import { TOAST_DURATION } from "../constants";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: User) => profileService.updateProfile(data),
    onSuccess: (response) => {
      console.log(response);
      toast.success("Personal information updated successfully!");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message, { duration: TOAST_DURATION });
    },
  });
};
