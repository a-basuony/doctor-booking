// hooks/useReviews.ts
import { useState, useEffect } from 'react';
import { api } from '../services/api'; 

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  patient: {
    id: number;
    name: string;
    photo?: string | null;
  };
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/all');
        if (res.data.success) setReviews(res.data.data);
        console.log('Reviews data:', res.data.data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setReviews([]);
      }
    };
    fetchReviews();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { reviews, isMobile, isHovered, setIsHovered };
};
