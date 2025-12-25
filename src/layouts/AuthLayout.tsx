import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "../hooks/useAuth";

interface AuthLayoutProps {
  children: ReactNode;
  noGoogle?: boolean;
}

const AuthLayout = ({ children, noGoogle }: AuthLayoutProps) => {
  const { mutate: googleLogin } = useGoogleLogin();

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Google OAuth success:", credentialResponse);
    // Send the ID token to your backend
    if (credentialResponse.credential) {
      googleLogin({ id_token: credentialResponse.credential });
    }
  };

  const handleGoogleError = () => {
    console.error("Google OAuth error");
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
          src={"/images/heart-logo.png"}
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

              <Box
                sx={{
                  mt: 3,
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                  border: "none",
                }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
