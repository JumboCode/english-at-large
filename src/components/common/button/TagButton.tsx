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
    className={`border-[1px] border-black p-2 rounded-full cursor-pointer select-none ${
      isSelected ? "bg-blue-200" : ""
    } ${className}`}
    onClick={onClick}
  >
    {label.replace("_", " ")}
  </div>
);

export default TagButton;
