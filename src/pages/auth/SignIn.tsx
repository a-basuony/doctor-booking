import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLayout from "../../layouts/AuthLayout";
import { ROUTES } from "../../constants/routes";
import { signInSchema } from "../../utils/validation";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    console.log("Sign in data:", data);
    //todo: sign-in logic
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
          Please Enter your phone number{" "}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register("phone")}
            fullWidth
            label="Phone Number"
            type="tel"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            margin="normal"
            autoComplete="tel"
            size="small"
            sx={{ borderRadius: "10px" }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 2, mb: 2, py: 1.5, textTransform: "capitalize" }}
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
