import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import SearchCard from './SearchCard';
import DateCard from './DateCard';
import PaymentCard from './PaymentCard';
import { PLACEHOLDERS } from './constants';
import type { HowItWorksProps } from './types';

export default function HowItWorks({ title = "How it works" }: HowItWorksProps) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(6);
  const [currentYear] = useState(2025);

  useEffect(() => {
    const i = setInterval(
      () => setPlaceholderIndex(p => (p + 1) % PLACEHOLDERS.length),
      2000
    );
    return () => clearInterval(i);
  }, []);

  const monthInfo = useMemo(() => {
    const first = new Date(currentYear, currentMonth, 1);
    return {
      startWeekday: first.getDay(),
      daysInMonth: new Date(currentYear, currentMonth + 1, 0).getDate(),
    };
  }, [currentMonth, currentYear]);

  const sliderSettings = {
    dots: true,
    arrows: false,
    slidesToShow: 1,
  };

  return (
    <section className="py-10">
      <h2 className="text-4xl text-center mb-10">{title}</h2>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-3 ">
        <SearchCard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={PLACEHOLDERS[placeholderIndex]}
        />

        <DateCard
          currentMonth={currentMonth}
          currentYear={currentYear}
          monthInfo={monthInfo}
          selectedDate={selectedDate}
          onPrev={() => setCurrentMonth(m => m - 1)}
          onNext={() => setCurrentMonth(m => m + 1)}
          onSelectDate={setSelectedDate}
          onConfirm={() => navigate("/BookingPage")}
        />

        <PaymentCard onPay={() => navigate("/BookingPage")} />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Slider {...sliderSettings}>
          <SearchCard
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={PLACEHOLDERS[placeholderIndex]}
          />

          <DateCard
            currentMonth={currentMonth}
            currentYear={currentYear}
            monthInfo={monthInfo}
            selectedDate={selectedDate}
            onPrev={() => setCurrentMonth(m => m - 1)}
            onNext={() => setCurrentMonth(m => m + 1)}
            onSelectDate={setSelectedDate}
            onConfirm={() => navigate("/BookingPage")}
          />

          <PaymentCard onPay={() => navigate("/BookingPage")} />
        </Slider>
      </div>
    </section>
  );
}
