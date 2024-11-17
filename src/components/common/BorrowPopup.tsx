"use client";
import { useState} from "react";
import BookDetail from "@/components/details";
import ConfirmPopup from "./ConfirmPopup";
import CommonButton from "@/components/common/button/CommonButton";
import { Book, BookStatus} from "@prisma/client";

interface BorrowPopupProps {
  book: Book;
  toggle: () => void;
}

const BorrowPopup = (props: BorrowPopupProps) => {
  const { toggle, book } = props;
  const [isNextBorrowOpen, setIsNextBorrowOpen] = useState(true);
  const exit = () => {
    toggle();
  };
  
  //this also needs to be changed to a request
  const updateBook: Book = {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    publisher: book.publisher,
    level: book.level, 
    bookType: book.bookType,
    scanLink: book.scanLink,
    description: book.description,
    notes: book.notes,
    status: BookStatus.Borrowed,
    skills: book.skills,
    releaseDate: book.releaseDate,
  };
  
  const toggleNextBorrow = async () => {
    setIsNextBorrowOpen(!isNextBorrowOpen);
    console.log("this is the book status after toggle", book.status)
  };

  return (
    <div>
      {isNextBorrowOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-5/12">
            <div className="flex justify-end items-center h-full"></div>
            <h1 className="font-[family-name:var(--font-rubik)] font-semibold text-2xl">
              Borrow
            </h1>
            <div className="text-[#757575] text-sm"> You are borrowing: </div>
            <hr className="h-px bg-[#D4D4D4] border-0 mt-5"></hr>
            <div className="flex grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-500 w-[150px] h-[190px]"> </div>

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
                onClick={toggleNextBorrow}
                altTextStyle="text-white font-[family-name:var(--font-rubik)] font-medium -ml-2"
              />
            </div>
          </div>
        </div>
      ) :(
        <div> 
          <ConfirmPopup
            updatedBook = {updateBook}
            book  = {book}
            toggle = {toggle}
          />
        </div>
        
        )}
    </div>
  );
};

export default BorrowPopup;
