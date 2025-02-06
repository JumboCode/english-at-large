import React from "react";
import CommonButton from "../common/button/CommonButton";
import XIcon from "@/assets/icons/X";

interface RemoveUserPopupProps {
  isOpen: boolean;
  exit: () => void;
  onConfirm: () => void;
}

const RemoveUserPopup = (props: RemoveUserPopupProps) => {
  const { isOpen, exit, onConfirm } = props;

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white py-6 px-12 rounded-lg shadow-lg min-w-max max-w-large flex flex-col gap-6">
          <div className="flex flex-row justify-between">
            <p className="text-black font-semibold text-2xl">
              Confirm User Removal
            </p>
            <button className="text-black" onClick={exit}>
              <XIcon />
            </button>
          </div>
          <hr />
          <p className="text-black text-lg font-medium">
            Are you sure you want to remove this user? This action cannot be undone.
          </p>
          <hr />
          <div className="flex flex-row gap-4">
            <CommonButton label="Cancel" onClick={exit} altStyle="w-1/2" />
            <CommonButton
              label="Remove User"
              onClick={() => {
                exit();
                onConfirm();
              }}
              altTextStyle="text-white"
              altStyle="bg-red-600 w-1/2"
            />
          </div>
        </div>
      </div>
    )
  );
};

export default RemoveUserPopup;
