import { BrowserRouter, Routes, Route} from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import Home from './pages/Home';
function App() {

  return (
 <BrowserRouter>

  {/* import navbar here */}

 <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/BookingPage" element={<BookingPage />} />
 </Routes>

  {/* import footer here */}


 </BrowserRouter>
  )
}

export default App
