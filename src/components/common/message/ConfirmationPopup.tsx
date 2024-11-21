"use client";
import CheckCircleIcon from "@/assets/icons/CheckCircle";
import FailCircleIcon from "@/assets/icons/FailCircle";
import CloseIcon from "@/assets/icons/Close";
import { useEffect } from "react";

interface SuccessProps {
  message: string;
  success: boolean;
  onDisappear: () => void;
}

export interface ConfirmationPopupState {
  message: string;
  success: boolean;
  shown: boolean;
}

export const EmptyConfirmationState: ConfirmationPopupState = {
  message: "",
  success: false,
  shown: false,
};

const ConfirmationPopup = (props: SuccessProps) => {
  const { message, success, onDisappear } = props;

  useEffect(()=> {
    setTimeout(() => {
      onDisappear();
    }, 5000)
  })

  return (
    <div className={"bottom-[15px] right-[15px] shadow-lg rounded-b-lg fixed bg-white"}>
      <div className={"h-1 " + (success ? "bg-green-500" : "bg-red-500")}></div>
      <div className="flex flex-row gap-x-[100px] p-3">
        <div className="flex flex-row gap-x-1">
          <div className="my-auto">
            {success ? <CheckCircleIcon /> : <FailCircleIcon />}
          </div>
          <div>{message}</div>
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
