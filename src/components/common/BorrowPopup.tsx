"use client";
import { useState } from "react";
import BookDetail from "@/components/Details";
import Image from "next/image";
import checkmark from "../../assets/icons/checkmark.svg";
import xmark from "../../assets/icons/xmark.svg";
import CommonButton from "@/components/common/button/CommonButton";
import { Book, BookStatus, Request as BookRequest } from "@prisma/client";
import { updateRequest, createRequest } from "../../lib/api/requests";

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

  const newRequest: Omit<BookRequest, "id"> = {
    userId: "cm3g6z8am0000120kqt2mvimz", // Foreign key to User
    bookId: book.id, // Foreign key to Book
    status: BookStatus.Borrowed,
    createdAt: new Date(),
    message: "User is borrowing book",
    bookTitle: book.title,
  };

  var borrowed = true;
  const setUnavailable = async () => {
    if (book.status === BookStatus.Available) {
      try {
        const response = await createRequest(newRequest);
        console.log("in try");
        // Ensure response is an array and access the first element
        if (Array.isArray(response) && response.length > 0) {
          const firstResponse = response[0]; // Access the first item
          if (firstResponse.id) {
            await updateRequest(firstResponse);
          } else {
            console.error("Response does not contain 'id':", firstResponse);
          }
        } else {
          console.log(Array.isArray(response))
          console.error("Invalid response:", response);
        }
      } catch (err) {
        console.error(err);
      }
      borrowed = true;
      console.log("borrowed is true");
    } else {
      borrowed = false;
      console.log("borrow is false");
    }
  };

  //   const setUnavailable = async () => {
  //         if (book.status === BookStatus.Available) {
  //           try {
  //             const response = await createRequest(newRequest);

  //             if (response && response.id) { // Check if response exists and contains 'id'
  //               await updateRequest(response.id);
  //             } else {
  //               console.error("Invalid response:", response);
  //             }
  //           } catch (err) {
  //             console.error(err);
  //           }
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       };

  //   const setUnavailable = async () => {
  //     if (book.status === BookStatus.Available) {
  //       try {
  //         const response = await Promise.resolve(createRequest(newRequest));
  //         await updateRequest(response);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };

  const imageStyle = {
    minHeight: "50px",
    minWidth: "50px",
  };

  const toggleNextBorrow = () => {
    setUnavailable()
    setIsNextBorrowOpen(!isNextBorrowOpen);
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
      ) : borrowed ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-5/12">
            <div className="flex justify-end items-center h-full">
              <button onClick={exit} className="bg-white text-gray-600 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-end items-center h-full"></div>
            <div className="flex justify-center m-6">
              <Image
                src={checkmark}
                alt="navy check mark"
                width={50}
                height={80}
                style={imageStyle}
              />
            </div>
            <div className="flex justify-center font-[family-name:var(--font-rubik)] font-semibold text-2xl m-2">
              You've borrowed the book!
            </div>
            <div className="flex justify-center text-[#757575] font-[family-name:var(--font-rubik)] text-xs mb-10">
              Please arrange a time with the EAL office to schedule your book
              pick-up.
            </div>
            <div className="flex row-span-2 mt-5 gap-3 justify-between">
              <a
                href="/dashboard"
                className="flex flex-row items-center w-56 h-10 text-[#202D74] justify-center gap-2 p-3 min-w-max border rounded-lg border-dark-blue font-[family-name:var(--font-rubik)] font-semibold bg-white text-sm"
              >
                Keep Browsing
              </a>
              <CommonButton
                label="Go to Shelf"
                altStyle="w-56 h-10 bg-[#202D74]"
                onClick={toggleNextBorrow}
                altTextStyle="text-white font-[family-name:var(--font-rubik)]  font-semibold -ml-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-5/12">
            <div className="flex justify-end items-center h-full">
              <button onClick={exit} className="bg-white text-gray-600 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-end items-center h-full"></div>
            <div className="flex justify-center m-6">
              <Image
                src={xmark}
                alt="navy x mark"
                width={50}
                height={80}
                style={imageStyle}
              />
            </div>
            <div className="flex justify-center font-[family-name:var(--font-rubik)] font-semibold text-2xl m-2">
              Book not borrowed: Unavailable
            </div>
            <div className="flex justify-center text-[#757575] font-[family-name:var(--font-rubik)] text-xs mb-10">
              Please check back later to see if the book is available.
            </div>
            <div className="flex row-span-2 mt-5 gap-3 justify-between">
              <a
                href="/dashboard"
                className="flex flex-row items-center w-56 h-10 text-[#202D74] justify-center gap-2 p-3 min-w-max border rounded-lg border-dark-blue font-[family-name:var(--font-rubik)] font-semibold bg-white text-sm"
              >
                Keep Browsing
              </a>
              <CommonButton
                label="Go to Shelf"
                altStyle="w-56 h-10 bg-[#202D74]"
                onClick={toggleNextBorrow}
                altTextStyle="text-white font-[family-name:var(--font-rubik)]  font-semibold -ml-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowPopup;
