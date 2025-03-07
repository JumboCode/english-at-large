"use client";
import { useState } from "react";
import BookDetail from "@/components/Details";
import ConfirmBookRequestPopup from "./ConfirmBookRequestPopup";
import CommonButton from "@/components/common/button/CommonButton";
import { User, BookRequest, RequestStatus } from "@prisma/client";
import Image from "next/image";
import imageToAdd from "../../assets/images/harry_potter.jpg";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { createQuickRequest } from "@/lib/api/requests";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
  usePopup,
} from "@/lib/context/ConfirmPopupContext";
import { BookWithRequests, getAvailableCopies } from "@/lib/util/types";
import { MAX_REQUESTS } from "@/lib/util/types";

interface BookPopupProps {
  book: BookWithRequests;
  toggleOpen: () => void;
  borrow: boolean;
}

const BookPopup = (props: BookPopupProps) => {
  const { toggleOpen, book, borrow } = props;
  const [isNextOpen, setIsNextOpen] = useState(true);
  const user = useCurrentUser(); // currently logged in user
  const { setConfirmPopup } = usePopup();
  const [success, setSuccess] = useState<boolean>(true);
  const exit = () => {
    toggleOpen();
  };
  const [errorMsg, setErrorMsg] = useState(""); 

  const toggleNext = async () => {
    if (user) {
      const requests = (user as User & { requests: BookRequest[]}).requests;
      const userRequested = requests.filter(
        (request) =>
          request.status !== RequestStatus.Returned &&
          request.status !== RequestStatus.Lost 
      )

      // checking if user already requested book
      if (requests && userRequested.some((req) => req.bookId === book.id)) {
        setErrorMsg(borrow 
          ? "You cannot borrow more than one copy of the same book." 
          : "You cannot hold more than one copy of the same book. ");
        setSuccess(false);
      }

      if (borrow) {
        // retrieving borrowed books
        const borrowed = userRequested.filter((req) => req.status !== RequestStatus.Hold);
        if (requests && borrowed.length > MAX_REQUESTS) {
          setErrorMsg("You have exceeded the borrow limit. Please return one before borrowing another");
          setSuccess(false);
        } 

      } else {
        // retrieving holds
        const holds = userRequested.filter((req) => req.status !== RequestStatus.Borrowed);
        if (requests && holds.length > MAX_REQUESTS) {
          setErrorMsg("You have exceeded the hold limit. Please wait before placing another hold.");
          setSuccess(false);
        }
      }

      if (!success) {
        setConfirmPopup({
          type: ConfirmPopupTypes.BOOK,
          action: borrow ? ConfirmPopupActions.BORROW : ConfirmPopupActions.PLACE,
          success: false,
        });
      } else {
        const request = await createQuickRequest(book, user, 
          borrow 
            ? RequestStatus.Requested
            : RequestStatus.Hold);
        setConfirmPopup({
          type: ConfirmPopupTypes.BOOK,
          action: borrow ? ConfirmPopupActions.BORROW : ConfirmPopupActions.PLACE,
          success: !!request,
        });
      }
      
    } // you shouldn't be here if you're not authenticated...
    setIsNextOpen(!isNextOpen);
  };

  return (
    <div>
      {isNextOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-5/12">
            <div className="flex justify-end items-center h-full"></div>
            <h1 className="font-[family-name:var(--font-rubik)] font-semibold text-2xl">
              {borrow ? "Borrow" : "Place hold"}
            </h1>
            <div className="text-[#757575] text-sm"> 
              You are {borrow ? "borrowing" : "placing a hold for"}: 
            </div>
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
                  copies={book.copies}
                  numPages={book.numPages}
                  availableCopies={getAvailableCopies(book)}
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
                onClick = {toggleNext}
                altTextStyle="text-white font-[family-name:var(--font-rubik)] font-medium -ml-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ConfirmBookRequestPopup toggle={toggleOpen} success={success} errorMsg={errorMsg}/>
        </div>
      )}
    </div>
  );
};

export default BookPopup;
