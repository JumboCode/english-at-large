"use client";
import { createContext, useContext, useState } from "react";
import { EmptyConfirmationState, ConfirmationPopupState, PopupTypes, PopupActions } from "./ConfirmationPopup";


export interface PopupContextType {
    popup: ConfirmationPopupState;
    setShowPopup: (type: PopupTypes, action: PopupActions, success?: boolean) => void;
    hidePopup: () => void;
};

export const PopupContext = createContext<PopupContextType | null>(null); 

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [popup, setPopup] = useState<ConfirmationPopupState>(
    EmptyConfirmationState
  );

  const setShowPopup = (type = PopupTypes.NONE, action = PopupActions.NONE, success = true) => {
    setPopup({
      type: type,
      action: action,
      success: success,
      shown: true,
    });
  }
  
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

