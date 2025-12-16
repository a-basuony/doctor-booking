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

  // تحديث قيمة السيرش فقط (بدون redirect)
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  // الانتقال لصفحة الدكتور
  const goToDoctorDetails = useCallback(() => {
    if (!query.trim()) return;
    navigate(`/doctor-details?search=${encodeURIComponent(query)}`);
  }, [navigate, query]);

  return {
    openMenu,
    toggleMenu,
    handleNavigate,
    query,
    handleSearchChange,
    goToDoctorDetails,
  };
}