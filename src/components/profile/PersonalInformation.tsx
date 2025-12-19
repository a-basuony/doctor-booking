import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { personalInfoSchema } from "../../utils/validation";
import type { User } from "../../types/auth";
import { useUpdateProfile } from "../../hooks/useProfile";
import {
  convertToBackendDateFormat,
  convertToFrontendDateFormat,
} from "../../utils/utils.";
import toast from "react-hot-toast";

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const PersonalInformation = ({ user }: { user: User | null }) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Calculate initial data from user
  const initialData = useMemo(() => {
    if (!user) return null;
    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.birthdate
        ? convertToFrontendDateFormat(user.birthdate)
        : "",
    };
  }, [user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  if (!user) {
    return <div>loadding...</div>;
  }

  const onSubmit = async (data: PersonalInfoFormData) => {
    // Check if data has changed using isDirty from React Hook Form
    if (!isDirty) {
      toast.error("No changes detected. Please modify the data before saving.");
      return;
    }

    console.log("Personal information data:", data);

    // Format data for API
    const convertedDate = data.dateOfBirth
      ? convertToBackendDateFormat(data.dateOfBirth)
      : undefined;

    console.log("Date before conversion:", data.dateOfBirth);
    console.log("Date after conversion:", convertedDate);

    const formattedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthdate: convertedDate,
    };

    console.log("Formatted data being sent:", formattedData);
    updateProfile(formattedData);
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600, color: "secondary.main", mb: 6 }}
      >
        Personal Information
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <TextField
            {...register("name")}
            fullWidth
            label="Name"
            InputLabelProps={{ shrink: true }}
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <TextField
            {...register("email")}
            fullWidth
            label="Email"
            type="email"
            InputLabelProps={{ shrink: true }}
            error={!!errors.email}
            helperText={errors.email?.message}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <TextField
            {...register("dateOfBirth")}
            fullWidth
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <TextField
            {...register("phone")}
            fullWidth
            label="Phone Number"
            type="tel"
            InputLabelProps={{ shrink: true }}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
        </Box>

        <Box
          sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInformation;
