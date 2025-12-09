import { Box, Button } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

interface AuthLayoutProps {
  children: ReactNode;
  noGoogle?: boolean;
}

const AuthLayout = ({ children, noGoogle }: AuthLayoutProps) => {
  const navigate = useNavigate();
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    //todo: Google sign-in logic
    setTimeout(() => {
      setIsSigningInWithGoogle(false);
      // Navigate to Home
      navigate(ROUTES.HOME);
    }, 1000);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Background Images  */}
      <Box
        component="img"
        src={"/images/auth/auth-layout.png"}
        alt="Auth illustration"
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: { xs: "100%", sm: "60%", md: "50%" },
          height: { xs: "50%", sm: "100%" },
          objectFit: "cover",
          zIndex: 1,
          display: { xs: "none", md: "block" },
        }}
      />
      <Box
        component="img"
        src={"/images/auth/auth-line.png"}
        alt="Auth decoration"
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: { xs: "100%", sm: "60%", md: "50%" },
          height: { xs: "50%", sm: "100%" },
          objectFit: "cover",
          zIndex: 1,
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Content Area*/}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
          position: "relative",
          zIndex: 1,
          p: { xs: 3, sm: 4, md: 6 },
          minHeight: "100vh",
        }}
      >
        {/* Heart Logo */}
        <Box
          component="img"
          src={"/heart-logo.png"}
          alt="Heart logo"
          sx={{
            width: { xs: "28px", sm: "35px" },
            height: { xs: "28px", sm: "35px" },
            objectFit: "contain",
            position: "absolute",
            top: { xs: "20px", sm: "30px", md: "50px" },
            left: { xs: "20px", sm: "50px", md: "100px" },
            zIndex: 1,
          }}
        />

        {/* Form Container */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "400px" },
            mx: { xs: "auto", md: 0 },
            ml: { xs: "auto", md: "200px" },
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {children}

          {noGoogle ?? (
            <>
              <p className=" relative w-full h-[2px] bg-neutral-300 ">
                <span className=" absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white text-neutral-300  w-6 h-6 rounded-full flex justify-center items-center">
                  or
                </span>
              </p>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                size="small"
                disabled={isSigningInWithGoogle}
                onClick={handleGoogleSignIn}
                sx={{ mt: 3, mb: 2, py: 1.5, textTransform: "capitalize", borderRadius: "10px" }}
              >
                <Box
                  component="img"
                  src={"/images/google.png"}
                  alt="Google logo"
                  sx={{
                    objectFit: "contain",
                    marginRight: "8px",
                  }}
                />
                {isSigningInWithGoogle
                  ? "Signing in..."
                  : "Sign in With Google"}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
