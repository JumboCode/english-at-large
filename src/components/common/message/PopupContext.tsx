"use client";
import { createContext, useContext, useState } from "react";
import { EmptyConfirmationState, ConfirmationPopupState, PopupTypes, PopupActions } from "./ConfirmationPopup";


export interface PopupContextType {
    popupStatus: ConfirmationPopupState;
    setShowPopup: (type: PopupTypes, action: PopupActions, success?: boolean, custom?: string) => void;
    hidePopup: () => void;
};

export const PopupContext = createContext<PopupContextType | null>(null); 

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [popupStatus, setPopup] = useState<ConfirmationPopupState>(
    EmptyConfirmationState
  );

  // Constructor to set fields from other files 
  const setShowPopup = (type = PopupTypes.NONE, action = PopupActions.NONE, success = true, custom = "") => {
    setPopup({
      type: type,
      action: action,
      success: success,
      shown: true,
      custom: custom,
    });
  }
  
  // Call in the onDisappear parameter; used when popup times out
  const hidePopup = () => {
    setPopup(EmptyConfirmationState);
  };

  return (
    <PopupContext.Provider value={{ popupStatus, setShowPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
}

/**
 * Custom hook to access popup context. 
 * Helps with setting popups in different files from showing them. 
 *
 * @returns popup context, including 'popupStatus', 'setShowPopup,' and 'hidePopup' 
 * @notes to be used with ConfirmationPopup 
 * @example
 * // Retrieving methods 
 * const { popupStatus, setShowPopup, hidePopup } = usePopup();
 * 
 * // Adding a book 
 * const handleClick = () => {
 *   setShowPopup(PopupTypes.BOOK, PopupActions.ADD, true);
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
      throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

