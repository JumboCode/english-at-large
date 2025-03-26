import DropArrowIcon from "@/assets/icons/DropArrow";
import { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";

interface DropdownProps {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  altButtonStyle?: string;
  leftIcon?: React.ReactElement;
}

const DatePicker = ({
  range,
  setRange,
  altButtonStyle,
  leftIcon,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        popupRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCalendar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`relative inline-block text-left ${altButtonStyle}`}>
      <div>
        {/* button */}
        <button
          ref={buttonRef}
          onClick={toggleCalendar}
          className="inline-flex min-w-12 w-full justify-center items-center gap-2 rounded-lg bg-white p-3 text-gray-900 hover:bg-gray-50 border border-dark-blue"
        >
          {leftIcon && leftIcon}
          <p className="text-sm font-medium text-dark-blue px-1">
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : "Select dates"}
          </p>
          <DropArrowIcon />
        </button>
      </div>

      {/* calendar */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 z-10"
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={(selectedRange) => {
              setRange(selectedRange || undefined);
            }}
            numberOfMonths={1}
            classNames={{
              root: "rounded-lg border p-3",
              month: "bg-gray-50 p-4 rounded-lg shadow-md",
              nav: "flex justify-between items-center p-2 text-lg",
              day: "text-center p-2 rounded-lg text-sm hover:bg-[#d3f0ff]",
              selected: "bg-[#A0DEFF]",
              outside: "bg-gray-50 hover:bg-transparent",
            }}
          />
          <p className="mt-2 text-sm text-gray-600">
            {range?.from && range?.to
              ? `Selected: ${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : "Please select a date range"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
