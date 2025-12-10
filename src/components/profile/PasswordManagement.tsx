import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

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
        Update your password to keep your account secure. Make sure your new password
        is strong and unique.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
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
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "info.light",
            borderRadius: "10px",
            border: "1px solid",
            borderColor: "info.main",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Password Requirements:
          </Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one lowercase letter</li>
            <li>Contains at least one number</li>
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => reset()}
            sx={{
              px: 4,
              py: 1.5,
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              px: 4,
              py: 1.5,
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
