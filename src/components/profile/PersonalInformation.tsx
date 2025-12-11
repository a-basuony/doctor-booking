import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { personalInfoSchema } from "../../utils/validation";

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

const PersonalInformation = () => {
  // Mock user data - replace with actual user data from context/state
  const defaultValues: PersonalInfoFormData = {
    name: "John",
    email: "john.doe@example.com",
    phone: "+1234567890",
    dateOfBirth: "1990-01-01",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

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
