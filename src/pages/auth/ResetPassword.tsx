import { useEffect } from "react";
import { Box, Button, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { ROUTES } from "../../constants/routes";
import { resetPasswordSchema } from "../../utils/validation";
import { useResetPassword } from "../../hooks/useAuth";
import type { ResetPasswordData } from "../../types/auth";
import PasswordInput from "../../components/common/PasswordInput";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const otp = location.state?.otp;
  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!phone || !otp) {
      navigate(ROUTES.PHONE_VERIFICATION);
    }
  }, [phone, otp, navigate]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!phone || !otp) return;

    const formattedData: ResetPasswordData = {
      phone,
      otp,
      new_password: data.newPassword,
      new_password_confirmation: data.confirmPassword,
    };

    resetPassword(formattedData);
  };

  return (
    <AuthLayout noGoogle>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "secondary.main" }}
        >
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Enter your new password
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <PasswordInput
            {...register("newPassword")}
            fullWidth
            label="New Password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            margin="normal"
            autoComplete="new-password"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <PasswordInput
            {...register("confirmPassword")}
            fullWidth
            label="Confirm Password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            margin="normal"
            autoComplete="new-password"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="small"
            disabled={isPending}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            {isPending ? "Resetting Password..." : "Reset Password"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
              <Link
                href={ROUTES.SIGN_IN}
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default ResetPassword;
