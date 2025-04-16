"use client";
import React from "react";

interface DetailProps {
  isbn: string[];
  publisher: string;
  releaseDate: string | null;
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
    <div
      className={`grid grid-cols-[120px_1fr] gap-y-2 ${altStyle} ${lineSpacing} ${fontSize}`}
    >
      <div className="text-gray-500">ISBN</div>
      <div>{[...new Set(isbn)].join(", ")}</div>

      <div className="text-gray-500">Publisher</div>
      <div>{publisher}</div>

      <div className="text-gray-500">Release</div>
      <div>{releaseDate ?? "1/1/1900"}</div>

      <div className="text-gray-500">Copies</div>
      <div>
        {copies}, {availableCopies} available
      </div>

      <div className="text-gray-500">No. of Pages</div>
      <div>{numPages}</div>
    </div>
  );
};

export default BookDetail;
