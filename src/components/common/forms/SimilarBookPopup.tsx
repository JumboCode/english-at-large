import XIcon from "@/assets/icons/X";
import { createBook, updateBook } from "@/lib/api/books";
import { Book } from "@prisma/client";
import React, { useState } from "react";
import {
  ConfirmPopupTypes,
  ConfirmPopupActions,
  usePopup,
} from "@/lib/context/ConfirmPopupContext";
import CommonButton from "@/components/common/button/CommonButton";

interface SimilarBookPopupProps {
  originalBook: Omit<Book, "id">;
  bookList: Book[];
  isOpen: boolean;
  exit: () => void;
}

const SimilarBookPopup = (props: SimilarBookPopupProps) => {
  const { originalBook, bookList, isOpen, exit } = props;
  const { setConfirmPopup } = usePopup();
  const [updatingBook, setUpdatingBook] = useState<number>(-1);

  const updateSimilar = async (index: number) => {
    console.log("IN update similar")
    if (!bookList[index].isbn.includes(originalBook.isbn[0])) {
      bookList[index].isbn.push(originalBook.isbn[0]);
    }

    bookList[index].copies += 1;
    const updatedBook = await updateBook(bookList[index]);

    setConfirmPopup({
      type: ConfirmPopupTypes.EXISTING_BOOK,
      action: ConfirmPopupActions.ADD,
      success: !!updatedBook,
    });
    exit();
  };

  const newBook = async () => {
    const createdBook = await createBook(originalBook);

    setConfirmPopup({
      type: ConfirmPopupTypes.BOOK,
      action: ConfirmPopupActions.ADD,
      success: !!createdBook,
    });

    exit();
  };

  if (isOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white pb-12 pt-6 px-12 min-w-[512px] min-h-96 w-2/5 h-2/5 rounded-lg shadow-lg  flex flex-col gap-6">
          <button
            className="text-black flex flex-row justify-end"
            onClick={exit}
          >
            <XIcon />
          </button>
          <p className="text-2xl font-semibold">
            Similar Book Found
          </p>
          <p className="text-sm font-normal text-gray-500">
            We&apos;ve found a book in your catalog with a similar title. Would you like to update the existing entry or add this as a new book?
          </p>

          <div className="flex justify-start gap-4">
            <p className="text-sm font-normal w-1/5">
              You are adding:
            </p>
            <p className="text-sm text-dark-blue font-normal w-full">
              {originalBook.title} by {originalBook.author}
            </p>
          </div>

          <div className="flex justify-start gap-4">
            <p className="text-sm font-normal w-1/5">
              Existing book(s): 
            </p>

            <select
              id="level"
              name="level"
              className="border-[1px] border-medium-grey-border border-solid rounded-lg block h-9 font-normal w-full mx-auto"
              onChange={(e) => setUpdatingBook(e.target.selectedIndex)}
            >
              {bookList.map((book, i) => {
                return (
                  <option key={i} value={book.title}>
                    {book.title} by {book.author}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex justify-end gap-4">
          <CommonButton
              label="Continue to add as new book"
              onClick={() => newBook()}
            />
            <CommonButton
              label="Update Existing Book"
              altTextStyle="text-white"
              altStyle="bg-dark-blue"
              onClick={() => updateSimilar(updatingBook)}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default SimilarBookPopup;
