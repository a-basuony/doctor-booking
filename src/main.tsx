import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';


import { BrowserRouter } from 'react-router-dom';
// استدعاء الـ Navbar و Footer
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>

        {/* Navbar ثابت */}
        <Navbar />

        {/* كل الصفحات */}
        <App />

        {/* Footer ثابت */}
        <Footer />

      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
