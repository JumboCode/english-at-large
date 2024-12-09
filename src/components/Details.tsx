"use client";
import React from "react";

interface DetailProps {
  isbn: string;
  publisher: string;
  releaseDate: string | null;
  copies: number;
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
    numPages,
    lineSpacing,
    verticalSpacing,
    fontSize,
    altStyle,
    altWidth,
  } = props;
  return (
    <div className={`flex row-span-2 my-5 ${altStyle}`}>
      <div className={`font-medium ${lineSpacing} ${fontSize}`}>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>ISBN</div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>
          Publisher
        </div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>Release</div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>Copies</div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>
          No. of Pages
        </div>
      </div>
      <div className={`${lineSpacing} ${verticalSpacing} ${fontSize}`}>
        <div className={`relative ${altWidth}`}>{isbn}</div>
        <div className={`relative ${altWidth}`}>{publisher}</div>{" "}
        <div className={`relative`}>{`${releaseDate ?? "1/1/1900"}`} </div>
        <div className={`relative ${altWidth}`}>{copies}</div>
        <div className={`relative ${altWidth}`}>{numPages}</div>
      </div>
    </div>
  );
};

export default BookDetail;
