"use client";
import React from "react";

interface ButtonProps { 
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  altStyle?: string; // will be tailwind styling later
}

const Button = (props: ButtonProps) => {
  const { label, onClick, icon, altStyle } = props; // this is called destructuring, otherwise we'd need to 
                                                    // write 'props.label' or 'props.onClick'
  // your code here 
  return (
    <div>
      <button onClick={onClick}>
        {label}
      </button>
    </div>
  )
}

export default Button; 
