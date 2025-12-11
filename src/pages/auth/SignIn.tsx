import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { ROUTES } from "../../constants/routes";
import { signInSchema } from "../../utils/validation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    console.log("Sign in data:", data);
    //todo: sign-in logic
    // Navigate to OTP verification
    navigate(ROUTES.VERIFY_OTP);
  };

  return (
    <AuthLayout>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "secondary.main" }}
        >
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Please enter your phone number and password{" "}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box sx={{ mt: 2, mb: 1 }}>
                <PhoneInput
                  defaultCountry="EG"
                  value={value}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-none focus:outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
          <TextField
            {...register("password")}
            fullWidth
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            autoComplete="current-password"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="small"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                href={ROUTES.SIGN_UP}
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignIn;
