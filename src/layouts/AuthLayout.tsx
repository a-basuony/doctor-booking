import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
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
        src={"/imgs/auth/auth-layout.png"}
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
        src={"/imgs/auth/auth-line.png"}
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
          src={"/imgs/heart-logo.png"}
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
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
