import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";

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
import FQAPage from "./pages/FQAPage";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";

// New Features
import SearchDoctor from "./pages/SearchDoctor";
import BookAppointment from "./pages/BookAppointment";
import FavoriteDoctors from "./pages/FavoriteDoctors";
import PhoneVerification from "./pages/auth/PhoneVerification";
import ResetPassword from "./pages/auth/ResetPassword";

// Route Guards
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import ScrollToTop from "./components/ScrollToTop ";

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
  typography: {
    fontFamily: '"Noto Sans Georgian", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" reverseOrder={false} />

      <ScrollToTop />

      <Routes>
        {/* Protected Routes - Require Authentication */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/BookingPage"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* Search & Appointments - Protected */}
        <Route
          path="/SearchDoctors"
          element={
            <ProtectedRoute>
              <SearchDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoriteDoctors />
            </ProtectedRoute>
          }
        />

        {/* Extra Routes - Protected */}
        <Route
          path="/doctor-details"
          element={
            <ProtectedRoute>
              <DoctorDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <DoctorMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactUsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/FQAPage"
          element={
            <ProtectedRoute>
              <FQAPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Terms & Privacy - Protected */}
        <Route
          path={ROUTES.PRIVACY_POLICY}
          element={
            <ProtectedRoute>
              <PrivacyPolicyPage />
            </ProtectedRoute>
          }
        />

        {/* Profile - Protected */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes - Public Only (redirect to home if authenticated) */}
        <Route
          path={ROUTES.SIGN_IN}
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.SIGN_UP}
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.VERIFY_OTP}
          element={
            <PublicRoute>
              <OTPVerification />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.PHONE_VERIFICATION}
          element={
            <PublicRoute>
              <PhoneVerification />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
