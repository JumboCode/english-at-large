"use client";
import { createContext, useContext, useState } from "react";
import { EmptyConfirmationState, ConfirmationPopupState } from "./ConfirmationPopup";

// used for removeModal popup handling - can also be used for other popups

export interface PopupContextType {
    popup: ConfirmationPopupState;
    setShowPopup: (message: string, success?: boolean) => void;
    hidePopup: () => void;
};

export const PopupContext = createContext<PopupContextType | null>(null); 

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [popup, setPopup] = useState<ConfirmationPopupState>(
    EmptyConfirmationState
  );

  const setShowPopup = (message: string, success = true) => {
    setPopup({
      message: message,
      success: success,
      shown: true,
    });
  }
  
  // Function to hide the popup
  const hidePopup = () => {
    setPopup(EmptyConfirmationState);
  };

  return (
    <PopupContext.Provider value={{ popup, setShowPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
}

// hook to safely use context in other files
export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
      throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

