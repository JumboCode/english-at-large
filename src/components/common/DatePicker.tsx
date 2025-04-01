import DropArrowIcon from "@/assets/icons/DropArrow";
import { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import CommonButton from "./button/CommonButton";
import "react-day-picker/style.css";

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
          className="absolute right-0 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 z-10 cursor-default"
        >
          <DayPicker
            mode="range"
            disabled={{ after: new Date() }}
            selected={range}
            onSelect={(selectedRange) => {
              setRange(selectedRange || undefined);
            }}
            numberOfMonths={1}
            classNames={{
              month: "bg-gray-50 px-4 py-2 rounded-lg shadow-md",
              day: "text-center text-sm",
              nav: "absolute right-2 py-3",
              selected: ""
            }}
            
          />
          <p className="mt-4 text-sm text-gray-600">
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : "All time"}
          </p>
          <CommonButton label={"Reset"} onClick={() => {setRange(undefined)}} altStyle={"h-4 mt-3"} />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
