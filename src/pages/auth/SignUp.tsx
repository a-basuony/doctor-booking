import { Box, TextField, Button, Typography, Link, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { ROUTES } from "../../constants/routes";
import { signUpSchema } from "../../utils/validation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    console.log("Sign up data:", data);
    //todo: sign-up logic
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
          Sign up
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please provide all information required to create your account{" "}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register("name")}
            fullWidth
            label="Name"
            type="text"
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="normal"
            autoComplete="name"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
          <TextField
            {...register("email")}
            fullWidth
            label="Email Address"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            autoComplete="email"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box sx={{ mt: 2, mb: 1 }}>
                <PhoneInput
                  defaultCountry="EG"
                  value={value}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.75, display: "block" }}
                  >
                    {errors.phone.message}
                  </Typography>
                )}
              </Box>
            )}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
            <TextField
              {...register("password")}
              fullWidth
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="new-password"
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              {...register("confirmPassword")}
              fullWidth
              label="Confirm Password"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              autoComplete="new-password"
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Stack>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="small"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, py: 1.5, textTransform: "capitalize", borderRadius: "10px" }}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
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

export default SignUp;
