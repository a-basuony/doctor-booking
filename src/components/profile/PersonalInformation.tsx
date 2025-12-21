import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import type { User } from "../../types/auth";
import { useUpdateProfile } from "../../hooks/useProfile";
import toast from "react-hot-toast";
import BirthdateSelect from "../BirthdateSelect";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  day: z.number().min(1).max(31).optional(),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(1900).max(new Date().getFullYear()).optional(),
});

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
      day: user.extra_data?.birthdate?.Day,
      month: user.extra_data?.birthdate?.Month,
      year: user.extra_data?.birthdate?.Year,
    };
  }, [user]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      day: undefined,
      month: undefined,
      year: undefined,
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  console.log("use is ", user);

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
    const formattedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthDay: data.day,
      birthMonth: data.month,
      birthYear: data.year,
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

        <Box sx={{ mt: 3 }}>
          <BirthdateSelect
            control={control}
            errors={{
              day: errors.day,
              month: errors.month,
              year: errors.year,
            }}
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
