"use client";
import CheckCircleIcon from "@/assets/icons/CheckCircle";
import FailCircleIcon from "@/assets/icons/FailCircle";
import CloseIcon from "@/assets/icons/Close";
import { useEffect } from "react";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
} from "@/lib/context/ConfirmPopupContext";

interface SuccessProps {
  type: ConfirmPopupTypes;
  action: ConfirmPopupActions;
  success: boolean;
  onDisappear: () => void;
  custom?: string;
}

const ConfirmationPopup = (props: SuccessProps) => {
  const { type, action, success, onDisappear, custom } = props;

  useEffect(() => {
    setTimeout(() => {
      onDisappear();
    }, 3000);
  });

  return (
    <div
      className={
        "bottom-[15px] right-[15px] shadow-lg rounded-b-lg fixed bg-white"
      }
    >
      <div className={"h-1 " + (success ? "bg-green-500" : "bg-red-500")}></div>
      <div className="flex flex-row gap-x-[100px] p-3">
        <div className="flex flex-row gap-x-1">
          <div className="my-auto">
            {success ? <CheckCircleIcon /> : <FailCircleIcon />}
          </div>
          <div className="text-black">
            {custom
              ? custom
              : success
              ? `Successfully ${action}${
                  action.endsWith("e") ? "d" : "ed"
                } ${type}.`
              : `Couldn't ${action} ${type}. Check your connection and try again.`}
          </div>
        </div>
        <div className="my-auto">
          <button
            onClick={() => {
              onDisappear();
            }}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
