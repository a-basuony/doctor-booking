import { Box, Button, Typography, Link } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AuthLayout from "../../layouts/AuthLayout";
import { ROUTES } from "../../constants/routes";
import { phoneVerificationSchema } from "../../utils/validation";
import { useForgetPassword } from "../../hooks/useAuth";
import type { ForgetPasswordData } from "../../types/auth";

type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>;

const PhoneVerification = () => {
  const { mutate: forgetPassword, isPending } = useForgetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = (data: PhoneVerificationFormData) => {
    const formattedData: ForgetPasswordData = {
      phone: data.phone,
    };

    forgetPassword(formattedData);
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
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Enter your phone number to receive a verification code
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box sx={{ mb: 1 }}>
                <PhoneInput
                  defaultCountry="EG"
                  value={value}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-none focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition no-focus"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{
                      mt: 0.5,
                      ml: 1.75,
                      display: "block",
                      textAlign: "start",
                    }}
                  >
                    {errors.phone.message}
                  </Typography>
                )}
              </Box>
            )}
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
            {isPending ? "Sending Code..." : "Send Verification Code"}
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

export default PhoneVerification;
