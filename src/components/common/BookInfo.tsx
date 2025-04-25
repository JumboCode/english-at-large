"use client";
import { Book, BookRequest, RequestStatus } from "@prisma/client";
import Image from "next/image";
import imageToAdd from "../../assets/images/Placeholder_Book_Cover.png";
import Link from "next/link";
import {
  getCurrentUserRequestOnBook,
  UserWithRequests,
} from "@/lib/util/types";
import { useMemo } from "react";
import CommonButton from "./button/CommonButton";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
  usePopup,
} from "@/lib/context/ConfirmPopupContext";
import { deleteRequest } from "@/lib/api/requests";
import ConfirmationPopup from "./message/ConfirmationPopup";

interface BookProps {
  book: Book;
  user?: UserWithRequests;
  onDelete?: () => void; // only for handling state refreshes
}

/**
 * Our internal button component which includes options for icons and adheres to our own styling system.
 * @param props: label
 * @param optional props: left/right icons, alternate Tailwind classes for the text and the
 * @returns a React Components.
 * @TODO: add in loading components
 */
const BookInfo = (props: BookProps) => {
  const { book, user, onDelete } = props;
  const { setConfirmPopup, hidePopup, popupStatus } = usePopup();

  const cancelReq = async (request: BookRequest) => {
    try {
      await deleteRequest(request.id);

      setConfirmPopup({
        type: ConfirmPopupTypes.REQUEST,
        action: ConfirmPopupActions.CANCEL,
        success: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setConfirmPopup({
        type: ConfirmPopupTypes.REQUEST,
        action: ConfirmPopupActions.CANCEL,
        success: false,
      });
    }
  };

  const currentRequest: BookRequest | undefined = useMemo(() => {
    return getCurrentUserRequestOnBook(book, user);
  }, [book, user]);
  return (
    <div className="items-start gap-4">
      <Link
        href={`/dashboard/books/${book.id}`}
        className="flex flex-col md:flex-row gap-4 items-start"
      >
        <div>
          <Image
            src={book.coverURL || imageToAdd.src}
            alt="Book Cover"
            width={210}
            height={300}
            className="w-full md:w-[210px] h-[300px] object-fill rounded-md"
          />
        </div>

        <div className="align-middle w-full md:w-3/5">
          <div className="text-left mt-4 mb-4">
            <h3 className="text-lg text-black font-semibold break-words">
              {book.title.slice(0, 80)}
            </h3>
            <p className="text-sm text-black mt-2 break-words">
              {"by"} {book.author.slice(0, 80)}{" "}
            </p>
          </div>

          {/* tags */}
          <div className="flex flex-wrap items-start">
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <p>
                  {book.bookType ? book.bookType.replace("_", " ") : "Not set"}
                </p>
              </div>
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <p>{book.level ? book.level.replace("_", " ") : "Not set"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {book.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center"
                  >
                    {skill.replace("_", " ")}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* SHELF ONLY */}
          {user && currentRequest ? (
            <>
              {currentRequest.status !== RequestStatus.Hold ? (
                <p className={"text-text-default-secondary italic mt-6"}>
                  Return by{" "}
                  {currentRequest.dueDate
                    ? new Date(currentRequest.dueDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long", // "May"
                          day: "numeric", // "24"
                          year: "numeric", // "2024"
                        }
                      )
                    : "N/A"}
                </p>
              ) : null}

              <CommonButton
                label={"Cancel"}
                altStyle="mt-5 rounded-lg ml-auto mr-4 transition duration-100 ease-in-out hover:bg-red-500 hover:text-white"
                onClick={(e) => {
                  e.preventDefault(); // Prevent Link navigation
                  e.stopPropagation();
                  // Perform your cancel logic here
                  cancelReq(currentRequest);
                  if (onDelete) {
                    onDelete(); // Notify parent (Shelf) to remove this BookInfo
                  }
                }}
              />
            </>
          ) : null}
        </div>
      </Link>
      {popupStatus.shown ? (
        <ConfirmationPopup
          type={popupStatus.type}
          action={popupStatus.action}
          success={popupStatus.success}
          onDisappear={() => hidePopup()}
          custom={popupStatus.custom}
        />
      ) : null}
    </div>
  );
};

export default BookInfo;
