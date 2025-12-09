
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import DoctorDetailsPage from "./pages/DoctorDetailsPage"
import DoctorMapPage from "./pages/DoctorMapPage"
import { Toaster } from "react-hot-toast";
import { PaymentPage } from './pages/PaymentPage';
import ContactUsPage from './pages/ContactUsPage';
function App() {


  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      {/* import navbar here */}

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/doctor-details" element={<DoctorDetailsPage />} />
        <Route path="/map" element={<DoctorMapPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
      </Routes>

      {/* import footer here */}


    </BrowserRouter>
  )
}

export default App





