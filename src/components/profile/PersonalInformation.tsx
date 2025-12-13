import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { personalInfoSchema } from "../../utils/validation";
import type { User } from "../../types/auth";

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const PersonalInformation = ({ user }: { user: User | null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "1990-01-01",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.bir_of_date || "1990-01-01",
      });
    }
  }, [user, reset]);

  if (!user) {
    return <div>loadding...</div>;
  }

  const onSubmit = async (data: PersonalInfoFormData) => {
    console.log("Personal information data:", data);
    // Add API call to update personal information here
    toast.success("Personal information updated successfully!");
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
            disabled={isSubmitting}
            sx={{
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInformation;
