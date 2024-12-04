"use client";
import CheckCircleIcon from "@/assets/icons/CheckCircle";
import FailCircleIcon from "@/assets/icons/FailCircle";
import CloseIcon from "@/assets/icons/Close";
import { useEffect } from "react";

interface SuccessProps {
  type: PopupTypes;
  action: PopupActions;
  success: boolean;
  onDisappear: () => void;
  custom?: string; 
}

export interface ConfirmationPopupState {
  type: PopupTypes;
  action: PopupActions;
  success: boolean;
  shown: boolean;
  custom?: string; 
}

export enum PopupActions {
  NONE = "",
  ADD = "add",
  EDIT = "edit",
  REMOVE = "remove",
  INVITE = "invite",
}

export enum PopupTypes {
  NONE = "",
  BOOK = "book",
  USER = "user",
  RESOURCE = "resource",
}

export const EmptyConfirmationState: ConfirmationPopupState = {
  type: PopupTypes.NONE,
  action: PopupActions.NONE,
  success: false,
  shown: false,
  custom: "",
};

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
          <div>
          {custom
            ? custom 
            : success 
              ? `Successfully ${action}ed ${type}.` 
              : `Couldn't ${action} ${type}. Check your connection and try again.`
          }  
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
