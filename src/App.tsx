import {Routes, Route} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import BookingPage from "./pages/BookingPage";
import Home from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import OTPVerification from "./pages/auth/OTPVerification";
import { ROUTES } from "./constants/routes";

// Extra pages
import DoctorDetailsPage from "./pages/DoctorDetailsPage";
import DoctorMapPage from "./pages/DoctorMapPage";
import { PaymentPage } from "./pages/PaymentPage";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// Tailwind-matching theme
const theme = createTheme({
  palette: {
    primary: {
      light: "#93b4de",
      main: "#145db8",
      dark: "#0e4283",
      contrastText: "#fff",
    },
    secondary: {
      light: "#586372",
      main: "#05162c",
      dark: "#04101f",
      contrastText: "#fff",
    },
    error: {
      light: "#fd8688",
      main: "#fc4b4e",
      dark: "#b33537",
      contrastText: "#fff",
    },
    warning: {
      light: "#ffc46e",
      main: "#ffa726",
      dark: "#b5771b",
      contrastText: "#fff",
    },
    info: {
      light: "#62b5ec",
      main: "#1490e3",
      dark: "#0e66a1",
      contrastText: "#fff",
    },
    success: {
      light: "#87c98a",
      main: "#4caf50",
      dark: "#367c39",
      contrastText: "#fff",
    },
    grey: {
      50: "#f5f6f7",
      100: "#e6e8ea",
      200: "#d0d4d8",
      300: "#bbc1c7",
      400: "#adb5bc",
      500: "#99a2ab",
      600: "#8b939c",
      700: "#6d7379",
      800: "#54595e",
      900: "#404448",
    },
  },
  typography: { fontFamily: '"Noto Sans Georgian", sans-serif' },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/BookingPage" element={<BookingPage />} />


          {/* Extra Routes */}
          <Route path="/doctor-details" element={<DoctorDetailsPage />} />
          <Route path="/map" element={<DoctorMapPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/FQAPage" element={<FQAPage />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* Terms and Conditions Page */}
          <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />

          {/* Profile Page */}
          <Route path={ROUTES.PROFILE} element={<Profile />} />

          {/* Auth Routes */}
          <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          <Route path={ROUTES.VERIFY_OTP} element={<OTPVerification />} />
        </Routes>

    </ThemeProvider>
  );
}

export default App;
