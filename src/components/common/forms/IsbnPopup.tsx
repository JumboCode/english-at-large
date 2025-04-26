"use client";
import React, { useState } from "react";
import XIcon from "@/assets/icons/X";
import CommonButton from "../button/CommonButton";

interface IsbnPopupProps {
  isOpen: boolean;
  exit: () => void; // exit does not change isbn, only exits the popup
  submit: (isbn: string) => void; // submit saves the isbn
}

const IsbnPopup = (props: IsbnPopupProps) => {
  const { isOpen, exit, submit } = props;
  const [isbnData, setIsbnData] = useState<string>("");
  const [isbnError, setIsbnError] = useState(false);

  const validateIsbn = (isbnVal: string) => {
    if (isbnVal.length !== 10 && isbnVal.length !== 13) {
      setIsbnError(true);
    } else {
      setIsbnError(false);
    }
    setIsbnData(isbnVal);
  };

  return (
    <div>
      {isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white pb-12 pt-6 px-12 min-w-[512px] min-h-96 w-2/5 h-2/5 rounded-lg shadow-lg  flex flex-col gap-6">
            <button
              className="text-black flex flex-row justify-end"
              onClick={exit}
            >
              <XIcon />
            </button>
            <div className="flex flex-col gap-2">
              <p className="text-black  font-semibold text-2xl font-[family-name:var(--font-rubik)]">
                Enter ISBN
              </p>
              <p className="text-text-default-secondary text-sm font-small font-[family-name:var(--font-rubik)] ">
                An ISBN or international Standard Number is a 13 digit number
                that identifies published books.
              </p>
              <p className="text-text-default-secondary text-sm font-small font-[family-name:var(--font-rubik)] ">
                Ex: 9783161484100
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 ">
                <input
                  type="text"
                  name="email"
                  className={`text-black border p-2 rounded-lg w-full outline-none ${
                    isbnError
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-medium-grey-border"
                  }`}
                  onChange={(event) => {
                    validateIsbn(event.target.value);
                  }}
                />
                <CommonButton
                  onClick={!isbnError ? () => submit(isbnData) : undefined}
                  label="Search"
                  altTextStyle="text-white"
                  disabled={isbnError}
                  altStyle={`bg-dark-blue ${
                    isbnError ? "opacity-50 cursor-not-allowed" : ""
                  }`} // Gray out when disabled
                ></CommonButton>{" "}
              </div>
              <div className="flex flex-row justify-between items-center mt-0.5">
                {isbnError && (
                  <p className="text-red-500 text-sm">Invalid ISBN</p>
                )}
              </div>
              {/* <Link
                className="text-dark-blue text-sm font-medium"
                href="/dashboard/books"
                onClick={() => submit(isbnData)}
              >
                No ISBN? Add book manually
              </Link> */}
            </div>
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default IsbnPopup;
