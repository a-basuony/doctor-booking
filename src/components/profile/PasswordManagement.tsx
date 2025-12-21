import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { passwordSchema } from "../../utils/validation";
import PasswordInput from "../common/PasswordInput";
import { useChangePassword } from "../../hooks/useAuth";

type PasswordFormData = z.infer<typeof passwordSchema>;

const PasswordManagement = () => {
  const { mutate: changePassword, isPending } = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    console.log("Password change data:", data);
    const formattedData = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      new_password_confirmation: data.confirmPassword,
    };

    changePassword(formattedData, {
      onSuccess: () => {
        reset();
      },
      onError: (error: any) => {
        // Handle validation errors from backend
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;

          // Map backend field names to form field names
          if (backendErrors.current_password) {
            setError("currentPassword", {
              type: "manual",
              message:
                backendErrors.current_password[0] ||
                "Current password is incorrect",
            });
          }
          if (backendErrors.new_password) {
            setError("newPassword", {
              type: "manual",
              message: backendErrors.new_password[0],
            });
          }
          if (backendErrors.new_password_confirmation) {
            setError("confirmPassword", {
              type: "manual",
              message: backendErrors.new_password_confirmation[0],
            });
          }
        }
      },
    });
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
            <PasswordInput
              {...register("currentPassword")}
              fullWidth
              label="Current Password"
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              size="small"
              autoComplete="current-password"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          <PasswordInput
            {...register("newPassword")}
            fullWidth
            label="New Password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            size="small"
            autoComplete="new-password"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <PasswordInput
            {...register("confirmPassword")}
            fullWidth
            label="Confirm New Password"
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
            disabled={isPending}
            sx={{
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PasswordManagement;
