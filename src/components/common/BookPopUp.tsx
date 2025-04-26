"use client";
import { useState } from "react";
import BookDetail from "@/components/Details";
import ConfirmBookRequestPopup from "./ConfirmBookRequestPopup";
import CommonButton from "@/components/common/button/CommonButton";
import { User, BookRequest, RequestStatus } from "@prisma/client";
import Image from "next/image";
import imageToAdd from "../../assets/images/Placeholder_Book_Cover.png";
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
  const [limitExceeded, setLimitExceeded] = useState(false);

  const [localBorrow, setLocalBorrow] = useState(borrow);

  const exit = () => {
    toggleOpen();
  };
  const toggleNext = async () => {
    let isSuccess = true;
    if (user) {
      const requests = (user as User & { requests: BookRequest[] }).requests;
      const userRequested = requests.filter(
        (request) =>
          request.status !== RequestStatus.Returned &&
          request.status !== RequestStatus.Lost
      );

      // checking if user already requested book or if limits are exceeded
      const borrowed = userRequested.filter(
        (req) => req.status !== RequestStatus.Hold
      );
      const holds = userRequested.filter(
        (req) =>
          req.status !== RequestStatus.Borrowed &&
          req.status !== RequestStatus.Requested
      );

      if (requests && userRequested.some((req) => req.bookId === book.id)) {
        isSuccess = false;
      } else if (
        (localBorrow && borrowed.length > MAX_REQUESTS) ||
        (!localBorrow && holds.length > MAX_REQUESTS)
      ) {
        isSuccess = false;
        setLimitExceeded(true);
      }

      if (isSuccess) {
        const request = await createQuickRequest(
          book,
          user,
          localBorrow ? RequestStatus.Requested : RequestStatus.Hold
        );
        if (borrow && request && request.status === RequestStatus.Hold) {
          setLocalBorrow(!localBorrow);
        }
        setConfirmPopup({
          type: localBorrow ? ConfirmPopupTypes.BOOK : ConfirmPopupTypes.HOLD,
          action: localBorrow
            ? ConfirmPopupActions.BORROW
            : ConfirmPopupActions.PLACE,
          success: !!request,
        });
        setSuccess(isSuccess);
      } else {
        setConfirmPopup({
          type: localBorrow ? ConfirmPopupTypes.BOOK : ConfirmPopupTypes.HOLD,
          action: localBorrow
            ? ConfirmPopupActions.BORROW
            : ConfirmPopupActions.PLACE,
          success: false,
        });
        setSuccess(isSuccess);
      }
    } // you shouldn't be here if you're not authenticated...
    setIsNextOpen(!isNextOpen);
  };

  return (
    <div>
      {isNextOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 md:w-5/12 max-w-lg">
            <div className="flex justify-end items-center h-full"></div>
            <h1 className="font-[family-name:var(--font-rubik)] font-semibold text-2xl">
              {localBorrow ? "Borrow" : "Place hold"}
            </h1>
            <div className="text-[#757575] text-sm">
              You are {localBorrow ? "borrowing" : "placing a hold for"}:
            </div>
            <hr className="h-px bg-[#D4D4D4] border-0 mt-5"></hr>
            <div className="flex flex-col lg:flex-row gap-4 mt-4">
              <Image
                src={book.coverURL || imageToAdd.src}
                alt="Book Cover"
                width={190}
                height={190}
                className="mx-auto md:mx-0 flex-shrink-0"
              />
              <div>
                <div className="font-[family-name:var(--font-rubik)] font-semibold text-2xl break-words mt-4 md:mt-0">
                  {book.title.slice(0, 80)}
                </div>
                <div className="text-[#757575] text-sm break-words">
                  {book.author.slice(0, 80)}
                </div>
                <BookDetail
                  isbn={book.isbn.length !== 0 ? book.isbn : ["None"]}
                  publisher={book.publisher ? book.publisher : "None"}
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
                onClick={toggleNext}
                altTextStyle="text-white font-[family-name:var(--font-rubik)] font-medium -ml-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ConfirmBookRequestPopup
            toggle={toggleOpen}
            success={success}
            borrow={localBorrow}
            limitExceeded={limitExceeded}
          />
        </div>
      )}
    </div>
  );
};

export default BookPopup;
