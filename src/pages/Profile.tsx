import { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "../components/profile/PersonalInformation";
import PasswordManagement from "../components/profile/PasswordManagement";
import { ROUTES } from "../constants/routes";
// import { useAuthContext } from "../hooks/useAuth";

const Profile = () => {
  // const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Mock user data - replace with actual user data from context/state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = {
    name: "Seif Mohamed",
    location: "129,El-Nasr Street, Cairo",
    email: "seif@example.com",
    phone: "+201234567890",
    bir_of_date: "1990-01-01",
    avatar: "/path/to/avatar.jpg", // Replace with actual avatar path
  };

  const tabs = [
    { id: 0, label: "Personal Information", icon: "/images/user.png" },
    { id: 1, label: "Password Management", icon: "/images/lock.png" },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          minHeight: { xs: "auto", md: "80vh" },
        }}
      >
        {/* Left Sidebar - 30% */}
        <Box
          sx={{
            width: { xs: "100%", md: "30%" },
            textAlign: "center",
            gap: 2,
            p: { xs: 2, sm: 3 },
            borderRadius: "13px",
            pt: { xs: 3, sm: "100px" },
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

          <Box
            sx={{
              position: "relative",
              borderRadius: "50%",
              mx: "auto",
              mb: 2,
              width: { xs: "100px", sm: "119px" },
              height: { xs: "100px", sm: "119px" },
            }}
          >
            <span className="profile-border" />
            <Box
              component="img"
              src={"/images/profile.jpg"}
              alt="profile page"
              sx={{
                objectFit: "cover",
                width: { xs: "94px", sm: "113px" },
                height: { xs: "94px", sm: "113px" },
                borderRadius: "50%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
            />
            <Box
              component="img"
              src={"/images/camera.png"}
              alt="camera"
              sx={{
                position: "absolute",
                bottom: { xs: "8px", sm: "16px" },
                right: 0,
                zIndex: 30,
                cursor: "pointer",
                width: { xs: "20px", sm: "24px" },
                height: { xs: "20px", sm: "24px" },
              }}
            />
          </Box>

          {/* Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            {user?.name}
          </Typography>

          {/* Location */}
          {user?.location && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                textAlign: "center",
                mb: 4,
                mx: "auto",
              }}
            >
              <Box
                component="img"
                src="/images/location.png"
                alt="location"
                sx={{ width: { xs: "16px", sm: "20px" } }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                {user.location}
              </Typography>
            </Box>
          )}

          {/* Custom Tabs */}
          <Box
            sx={{
              width: "100%",
              mt: 2,
              display: { xs: "grid", md: "block" },
              gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            {tabs.map((tab) => (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  flexDirection: { xs: "column", sm: "row", md: "row" },
                  gap: { xs: 1, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  mb: { xs: 0, md: 1 },
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor:
                    activeTab === tab.id ? "primary.main" : "transparent",
                  // color: activeTab === tab.id ? "white" : "text.primary",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(20, 93, 184, 0.08)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={tab.icon}
                  alt={tab.label}
                  sx={{
                    width: { xs: 18, sm: 20 },
                    height: { xs: 18, sm: 20 },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
                    color: "secondary.main",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Logout Button */}
          <Button
            variant="text"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{
              mt: { xs: 2, md: 3 },
              py: { xs: 1, sm: 1.5 },
              textTransform: "capitalize",
              borderRadius: "10px",
              display: "flex",
              justifyContent: { xs: "center", md: "start" },
              gap: "8px",
              fontSize: { xs: "0.85rem", sm: "1rem" },
            }}
          >
            <Box
              component="img"
              src="/images/logout.png"
              alt="logout"
              sx={{ width: { xs: "18px", sm: "20px" } }}
            />
            Log Out
          </Button>
        </Box>

        {/* Right Content Area - 70% */}
        <Box
          sx={{
            width: { xs: "100%", md: "70%" },
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          {activeTab === 0 && <PersonalInformation user={user} />}
          {activeTab === 1 && <PasswordManagement />}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
