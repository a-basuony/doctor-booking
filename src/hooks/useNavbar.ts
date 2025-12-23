// useNavbarLogic.ts
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

// TypeScript type للـ Doctor
export interface Doctor {
  id: number;
  name: string;
  profile_photo: string | null;
  specialty?: {
    id: number;
    name: string;
    image?: string;
  };
  clinic_address: string;
  experience_years: number;
  session_price: number;
  bio: string;
}

export function useNavbarLogic() {
  const [openMenu, setOpenMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Doctor[]>([]);

  const allResultsRef = useRef<Doctor[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    setOpenMenu((prev) => !prev);
  }, []);

  const handleNavigate = useCallback(
    (link: string) => {
      navigate(link);
      setOpenMenu(false);
    },
    [navigate]
  );

  // Debounced search (يعتمد على api instance)
  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(async () => {
        if (!value.trim()) {
          setResults([]);
          return;
        }

        try {
          // لو البيانات مخزنة قبل كده نفلتر محلي
          if (allResultsRef.current.length > 0) {
            const filtered = allResultsRef.current.filter(
              (d) =>
                d.name.toLowerCase().includes(value.toLowerCase()) ||
                d.specialty?.name
                  .toLowerCase()
                  .includes(value.toLowerCase())
            );

            setResults(filtered);
            return;
          }

          // أول مرة نجيب من API
          const res = await api.get(
            `/doctors?search=${encodeURIComponent(value)}`
          );

          const data: Doctor[] = res.data?.data || [];

          allResultsRef.current = data;
          setResults(data);
          console.log("Search results:", data);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        }
      }, 400);
    },
    []
  );

  const goToDoctorDetails = useCallback(() => {
    if (!query.trim()) return;
    if (results.length > 0) {
      navigate(`/doctor-details/${results[0].id}`);
    }
  }, [navigate, query, results]);

  const goToDoctorById = useCallback(
    (id: number) => {
      navigate(`/doctor-details/${id}`);
      setQuery("");
      setResults([]);
    },
    [navigate]
  );

  return {
    openMenu,
    toggleMenu,
    handleNavigate,
    query,
    handleSearchChange,
    goToDoctorDetails,
    results,
    goToDoctorById,
  };
}
