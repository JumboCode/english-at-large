"use client";
import { useState } from "react";
import BookDetail from "@/components/Details";
import ConfirmBookRequestPopup from "./ConfirmBookRequestPopup";
import CommonButton from "@/components/common/button/CommonButton";
import { Book, RequestStatus } from "@prisma/client";
import Image from "next/image";
import imageToAdd from "../../assets/images/harry_potter.jpg";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { createQuickRequest } from "@/lib/api/requests";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
  usePopup,
} from "@/lib/context/ConfirmPopupContext";

interface HoldPopupProps {
  book: Book;
  toggleOpen: () => void;
}

const HoldPopup = (props: HoldPopupProps) => {
  const { toggleOpen, book } = props;
  const [isNextHoldOpen, setIsNextHoldOpen] = useState(true);
  const user = useCurrentUser(); // currently logged in user
  const { setConfirmPopup } = usePopup();
  const exit = () => {
    toggleOpen();
  };

  
  const toggleNextHold = async () => {
    if (user) {
      const request = await createQuickRequest(book, user, RequestStatus.Hold);

      setConfirmPopup({
        type: ConfirmPopupTypes.HOLD,
        action: ConfirmPopupActions.PLACE,
        success: !!request,
      });
    } 
    setIsNextHoldOpen(!isNextHoldOpen);
  };

  return (
    <div>
      {isNextHoldOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-5/12">
            <div className="flex justify-end items-center h-full"></div>
            <h1 className="font-[family-name:var(--font-rubik)] font-semibold text-2xl">
              Place Hold
            </h1>
            <div className="text-[#757575] text-sm"> You are placing a hold for: </div>
            <hr className="h-px bg-[#D4D4D4] border-0 mt-5"></hr>
            <div className="flex grid-cols-2 gap-4 mt-4 ">
              <Image
                src={book.coverURL || imageToAdd.src}
                alt="Book Cover"
                width={150}
                height={190}
                // className="w-full h-full object-fill"
              />
              <div>
                <div className="font-[family-name:var(--font-rubik)] font-semibold text-2xl">
                  {book.title}
                </div>
                <div className="text-[#757575] text-sm">{book.author}</div>
                <BookDetail
                  isbn={book.isbn}
                  publisher={book.publisher}
                  releaseDate={book.releaseDate}
                  copies={10}
                  availableCopies={book.availableCopies}
                  numPages={book.numPages}
                  altStyle="flex row-span-2 my-5"
                  altWidth="pb-3"
                />
              </div>
            </div>
            <hr className="h-px bg-[#D4D4D4] border-0"></hr>
            <div className="flex row-span-2 mt-5 gap-3 justify-end">
              <CommonButton
                label="Cancel"
                altStyle="w-36 h-10 border-[#757575]"
                onClick={exit}
                altTextStyle="text-gray-900 font-[family-name:var(--font-rubik)] font-medium -ml-2"
              />
              <CommonButton
                label="Confirm"
                altStyle="w-36 h-10 bg-[#202D74]"
                onClick={toggleNextHold}
                altTextStyle="text-white font-[family-name:var(--font-rubik)] font-medium -ml-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ConfirmBookRequestPopup toggle={toggleOpen} action="placed a hold" />
        </div>
      )}
    </div>
  );
};

export default HoldPopup;
