import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const Home = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box
        component="img"
        src="/imgs/heart-logo.png"
        alt="Heart logo"
        sx={{
          width: "80px",
          height: "80px",
          mb: 4,
        }}
      />
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 600, color: "secondary.main" }}
      >
        Welcome to Doctor Booking
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        You have successfully signed in!
      </Typography>
      <Button
        variant="outlined"
        size="large"
        onClick={handleSignOut}
        sx={{ textTransform: "capitalize" }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default Home;
