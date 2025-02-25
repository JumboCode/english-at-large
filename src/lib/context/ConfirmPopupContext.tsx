"use client";
import { createContext, useContext, useState } from "react";

interface ConfirmPopupProps {
  type: ConfirmPopupTypes;
  action: ConfirmPopupActions;
  success?: boolean;
  customMessage?: string;
}

export interface PopupContextType {
  popupStatus: ConfirmationPopupState;
  setConfirmPopup: (props: ConfirmPopupProps) => void;
  hidePopup: () => void;
}

export interface ConfirmationPopupState {
  type: ConfirmPopupTypes;
  action: ConfirmPopupActions;
  success: boolean;
  shown: boolean;
  custom?: string;
}

export enum ConfirmPopupActions {
  NONE = "",
  ADD = "add",
  EDIT = "edit",
  REMOVE = "remove",
  INVITE = "invite",
  BORROW = "borrow",
  MARK = "mark",
  PLACE = "place",
}

export enum ConfirmPopupTypes {
  NONE = "",
  BOOK = "book",
  USER = "user",
  RESOURCE = "resource",
  RETURNED = "as returned",
  HOLD = "a hold",
}

export const EmptyConfirmationState: ConfirmationPopupState = {
  type: ConfirmPopupTypes.NONE,
  action: ConfirmPopupActions.NONE,
  success: false,
  shown: false,
  custom: "",
};

export const PopupContext = createContext<PopupContextType | null>(null);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [popupStatus, setPopup] = useState<ConfirmationPopupState>(
    EmptyConfirmationState
  );

  // Constructor to set fields from other files
  const setConfirmPopup = ({
    type = ConfirmPopupTypes.NONE,
    action = ConfirmPopupActions.NONE,
    success = true,
    customMessage = "",
  }) => {
    setPopup({
      type: type,
      action: action,
      success: success,
      shown: true,
      custom: customMessage,
    });
  };

  // Call in the onDisappear parameter; used when popup times out
  const hidePopup = () => {
    setPopup(EmptyConfirmationState);
  };

  return (
    <PopupContext.Provider value={{ popupStatus, setConfirmPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

/**
 * Custom hook to access popup context.
 * Helps with setting popups in different files from showing them.
 *
 * @returns popup context, including 'popupStatus', 'setConfirmPopup,' and 'hidePopup'
 * @notes to be used with ConfirmationPopup
 * @example
 * // Retrieving methods
 * const { popupStatus, setConfirmPopup, hidePopup } = usePopup();
 *
 * // Adding a book
 * const handleClick = () => {
 *   setConfirmPopup(ConfirmPopupTypes.BOOK, ConfirmPopupActions.ADD, true);
 * };
 *
 * // Displaying popups in returns
 * {popupStatus.shown ? (
 *   <ConfirmationPopup
 *      type={popupStatus.type}
 *      action={popupStatus.action}
 *      success={popupStatus.success}
 *      onDisappear={() => hidePopup()}
 *      custom={popupStatus.custom}
 *    />
 *  ) : null}
 */
export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
