import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ROUTES } from "../constants/routes";
import App from "../App";

function Layout() {
  const location = useLocation();

  // we don't want Navbar and Footer in auth pages
  const authRoutes = [ROUTES.SIGN_IN, ROUTES.SIGN_UP, ROUTES.VERIFY_OTP];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <App />
      {!isAuthPage && <Footer />}
    </>
  );
}

export default Layout;
