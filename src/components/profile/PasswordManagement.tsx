import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { passwordSchema } from "../../utils/validation";

type PasswordFormData = z.infer<typeof passwordSchema>;

const PasswordManagement = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    console.log("Password change data:", data);
    // Add API call to update password here
    toast.success("Password updated successfully!");
    reset();
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600, color: "secondary.main", mb: 3 }}
      >
        Password Management
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your password to keep your account secure. Make sure your new
        password is strong and unique.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
            <TextField
              {...register("currentPassword")}
              fullWidth
              label="Current Password"
              type="password"
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              size="small"
              autoComplete="current-password"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          <TextField
            {...register("newPassword")}
            fullWidth
            label="New Password"
            type="password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            size="small"
            autoComplete="new-password"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <TextField
            {...register("confirmPassword")}
            fullWidth
            label="Confirm New Password"
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            size="small"
            autoComplete="new-password"
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
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PasswordManagement;
