import XIcon from "@/assets/icons/X";
import { createBook, updateBook } from "@/lib/api/books";
import { Book } from "@prisma/client";
import React from "react";
import {
  ConfirmPopupTypes,
  ConfirmPopupActions,
  usePopup,
} from "@/lib/context/ConfirmPopupContext";

interface SimilarBookPopupProps {
  originalBook: Omit<Book, "id">;
  bookList: Book[];
  isOpen: boolean;
  exit: () => void;
}

const SimilarBookPopup = (props: SimilarBookPopupProps) => {
  const { originalBook, bookList, isOpen, exit } = props;
  const { setConfirmPopup } = usePopup();

  const updateSimilar = async (index: number) => {
    if (!bookList[index].isbn.includes(originalBook.isbn[0])) {
      bookList[index].isbn.push(originalBook.isbn[0]);
    }

    bookList[index].copies += 1;
    bookList[index].availableCopies += 1;
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
          <p className="font-semibold text-xl">
            This title seems similar to ones already in the collection...
          </p>
          {bookList.map((book, i) => {
            return (
              <button
                onClick={() => updateSimilar(i)}
                className="flex flex-row gap-4 border-y border-black"
                key={i}
              >
                <p className="font-semibold">{book.title}</p>
                <p className="text-gray">{book.publisher}</p>
              </button>
            );
          })}
          <button className="text-blue-500 " onClick={() => newBook()}>
            None of these match? <u>Add {originalBook.title} as a new book?</u>
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default SimilarBookPopup;
