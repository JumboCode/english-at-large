"use client";
interface TagButtonProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
}

const TagButton = ({
  label,
  isSelected = false,
  onClick,
  className = "",
}: TagButtonProps) => (
  <div
    className={`bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center cursor-pointer  ${
      isSelected ? "bg-blue-900 text-white " : ""
    } ${className}`}
    onClick={onClick}
  >
    {label.replace("_", " ")}
  </div>
);

export default TagButton;
