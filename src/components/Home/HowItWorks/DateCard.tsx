import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { DAYS_OF_WEEK, MONTH_NAMES } from './constants';

type Props = {
  currentMonth: number;
  currentYear: number;
  monthInfo: { startWeekday: number; daysInMonth: number };
  selectedDate: number | null;
  onPrev: () => void;
  onNext: () => void;
  onSelectDate: (day: number) => void;
  onConfirm: () => void;
};

export default function DateCard({
  currentMonth,
  currentYear,
  monthInfo,
  selectedDate,
  onPrev,
  onNext,
  onSelectDate,
  onConfirm,
}: Props) {
  return (
    <div className="border border-gray-400 rounded-3xl shadow-sm bg-white overflow-hidden m-5">
      <div className="h-64 flex items-center justify-center px-6">
        <div className="w-full max-w-xl border border-gray-400 rounded-xl p-2">
          <div className="flex justify-between items-center mb-3 ">
            <button onClick={onPrev}><FiChevronLeft /></button>
            <span className="text-sm font-medium">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button onClick={onNext}><FiChevronRight /></button>
          </div>

          <div className="grid grid-cols-7 text-xs text-center mb-2">
            {DAYS_OF_WEEK.map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1 max-h-40 overflow-y-auto">
            {Array.from({ length: monthInfo.startWeekday }).map((_, i) => (
              <div key={i} />
            ))}

            {Array.from({ length: monthInfo.daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <button
                  key={day}
                  onClick={() => onSelectDate(day)}
                  className={`h-8 w-8 mx-auto rounded ${
                    selectedDate === day
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-7 py-6 shadow-[0_-4px_10px_rgba(0,0,0,0.12)]">
        <h3 className="text-xl font-serif mb-2">Choose a Date & Time</h3>
        <p className="text-sm text-gray-600">
          Pick a slot that works for you.
        </p>

        {selectedDate && (
          <button
            onClick={onConfirm}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Go to Booking
          </button>
        )}
      </div>
    </div>
  );
}
