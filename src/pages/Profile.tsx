import { useState } from "react";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "../components/profile/PersonalInformation";
import PasswordManagement from "../components/profile/PasswordManagement";
import { ROUTES } from "../constants/routes";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Mock user data - replace with actual user data from context/state
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/path/to/avatar.jpg", // Replace with actual avatar path
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 3, minHeight: "80vh" }}>
        {/* Left Sidebar - 30% */}
        <Box
          sx={{
            width: "30%",
            textAlign: "center",
            gap: 2,
            p: 3,
            borderRadius: "13px",
            pt: "100px",
            // minHeight: "593px",
          }}
          className="!bg-neutral-50"
        >
          {/* Avatar */}
          {/* <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 120,
              height: 120,
              margin: "auto",
              mb: 2,
              border: "4px solid",
              borderColor: "primary.main",
            }}
          >
            {user.name.charAt(0)}
          </Avatar> */}

          <div className="bg-red-600 rounded-full w-[113px] h-[113px]">
            {/* <Box
              component="img"
              src={"/images/profile.jpg"}
              alt="profile page"
              sx={{
                objectFit: "contain",
                width: 120,
                height: 120,
                margin: "auto",
                mb: 2,
                borderRadius: "100%",
                transform: "scale(1.5)",
              }}
            /> */}
          </div>

          {/* Name */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, textAlign: "center" }}
          >
            {user.name}
          </Typography>

          {/* Email */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 2 }}
          >
            {user.email}
          </Typography>

          {/* Tabs */}
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              width: "100%",
              "& .MuiTab-root": {
                alignItems: "flex-start",
                textTransform: "none",
                fontSize: "1rem",
                minHeight: 48,
              },
            }}
          >
            <Tab label="Personal Information" />
            <Tab label="Password Management" />
          </Tabs>

          {/* Logout Button */}
          <Button
            variant="text"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{
              mt: 3,
              py: 1.5,
              textTransform: "capitalize",
              borderRadius: "10px",
            }}
          >
            Log Out
          </Button>
        </Box>

        {/* Right Content Area - 70% */}
        <Box
          sx={{
            width: "70%",
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          {activeTab === 0 && <PersonalInformation />}
          {activeTab === 1 && <PasswordManagement />}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
