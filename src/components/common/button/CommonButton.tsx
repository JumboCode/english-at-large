"use client";
import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  altStyle?: string;
  altTextStyle?: string;
  disabled?: boolean;
}

/**
 * Our internal button component which includes options for icons and adheres to our own styling system.
 * @param props: label
 * @param optional props: left/right icons, alternate Tailwind classes for the text and the
 * @returns a React Components.
 * @TODO: add in loading components
 */
const CommonButton = (props: ButtonProps) => {
  const {
    label,
    onClick,
    leftIcon,
    rightIcon,
    altStyle,
    altTextStyle,
    disabled,
  } = props;

  // if icon isn't passed in, nothing will show
  return (
    <button
      onClick={onClick}
      className={`flex flex-row items-center gap-2 p-3 min-w-max border rounded-lg border-dark-blue bg-white" ${altStyle}`}
      disabled={disabled}
    >
      {leftIcon ? leftIcon : null}
      <p className={`text-dark-blue text-sm ${altTextStyle}`}>{label}</p>

      {rightIcon ? rightIcon : null}
    </button>
  );
};

export default CommonButton;
