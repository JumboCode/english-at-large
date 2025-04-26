"use client";
import React from "react";

interface DetailProps {
  isbn: string[];
  publisher: string;
  releaseDate: Date | null;
  copies: number;
  availableCopies: number;
  numPages: number | null;
  lineSpacing?: string;
  verticalSpacing?: string;
  fontSize?: string;
  altStyle?: string;
  altWidth?: string;
}

const BookDetail = (props: DetailProps) => {
  const {
    isbn,
    publisher,
    releaseDate,
    copies,
    availableCopies,
    numPages,
    lineSpacing,
    verticalSpacing,
    fontSize,
    altStyle,
    altWidth,
  } = props;

  return (
    <div className={`flex flex-col my-5 ${altStyle} ${lineSpacing} max-w-sm`}>
      {[
        { label: "ISBN", value: [...new Set(isbn)].join(", ") },
        { label: "Publisher", value: publisher },
        {
          label: "Release",
          value: releaseDate
            ? new Date(releaseDate).toISOString().split("T")[0]
            : "None",
        },
        {
          label: "Copies",
          value: `${copies}, ${availableCopies} available`,
        },
        { label: "No. of Pages", value: numPages ?? "None" },
      ].map((item, idx) => (
        <div
          key={idx}
          className={`flex justify-between mb-1 ${fontSize} ${verticalSpacing}`}
        >
          <div className={`text-gray-500 font-medium ${altWidth}`}>
            {item.label}
          </div>
          <div className={`text-black ${altWidth}`}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default BookDetail;
