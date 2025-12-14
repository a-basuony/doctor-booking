import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useNavbarLogic() {
  const [openMenu, setOpenMenu] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    setOpenMenu(prev => !prev);
  }, []);

  const handleNavigate = useCallback(
    (link: string) => {
      navigate(link);
      setOpenMenu(false);
    },
    [navigate]
  );

  // البحث الآن مجرد redirect لصفحة doctor-details
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (!value.trim()) return;
      navigate(`/doctor-details`); // ID ثابت مؤقت
    },
    [navigate]
  );

  const goToDoctorDetails = useCallback(
    (id: number) => {
      navigate(`/doctor-details`);
    },
    [navigate]
  );

  return {
    openMenu,
    toggleMenu,
    handleNavigate,
    query,
    handleSearch,
    goToDoctorDetails,
  };
}
