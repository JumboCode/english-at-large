"use client";
import React, { useState } from "react";
import XIcon from "@/assets/icons/X";
import Link from "next/link";
import CommonButton from "../button/CommonButton";

interface IsbnPopupProps {
  isOpen: boolean;
  exit: () => void; // exit does not change isbn, only exits the popup
  submit: (isbn: string) => void; // submit saves the isbn
}

const IsbnPopup = (props: IsbnPopupProps) => {
  const { isOpen, exit, submit } = props; 
  const [isbnData, setIsbnData] = useState<string>("");
  
  return (
    <div>
      {isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
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

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 ">
                <input
                  type="text"
                  name="email"
                  className="text-black border border-medium-grey-border p-2 rounded-lg  w-full"
                  onChange={(event) => {
                    setIsbnData(event.target.value);
                  }}
                />
                <CommonButton
                  onClick={() => submit(isbnData)}
                  label="Search"
                  altTextStyle="text-white"
                  altStyle="bg-dark-blue"
                ></CommonButton>{" "}
              </div>
              <Link
                className="text-dark-blue "
                href="/dashboard/books"
                onClick={() => submit(isbnData)}
              >
                Add book manually
              </Link>
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
