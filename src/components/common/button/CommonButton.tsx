"use client";
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactElement;
  altStyle?: string; // will be tailwind styling later
}

const CommonButton = (props: ButtonProps) => {
  const { label, onClick, icon, altStyle } = props;

  // if icon isn't passed in, nothing will show
  return (
    <div // added conditional styling. use the `` and ${} syntax for inserting variables into string
      className={`text-white w-20 h-10 rounded-md bg-blue-800 hover:bg-blue-900 flex items-center ${altStyle}`}
    >
      <button onClick={onClick} className="flex justify-center items-center">
        {label}
        {icon ? icon : null}
      </button>
    </div>
  );
};

export default CommonButton;
