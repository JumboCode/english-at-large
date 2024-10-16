"use client";
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  altStyle?: string; // will be tailwind styling later
}

const Button = (props: ButtonProps) => {
  const { label, onClick, icon = false, altStyle } = props;

  // if icon isn't passed in, nothing will show
  return (
    <div className="text-white w-20 h-10 rounded-md bg-blue-800 hover:bg-blue-900 flex items-center">
      <button onClick={onClick}>
        {label}
        {icon}
      </button>
    </div>
  );
};

export default Button;
