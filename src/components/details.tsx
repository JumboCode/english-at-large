"use client";
import React from "react";

interface DetailProps {
  isbn: string;
  publisher: string;
  releaseDate: string | null;
  copies: number;
  altStyle?: string;
  altWidth?: string;
}

const BookDetail = (props: DetailProps) => {
  const { isbn, publisher, releaseDate, copies, altStyle, altWidth } = props;
  return (
    <div className={`${altStyle}`}>
      <div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>ISBN</div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>Publisher</div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>Release</div>
        <div className={`relative text-gray-500 mr-4 ${altWidth}`}>Copies</div>
      </div>
      <div>
        <div className={`relative ${altWidth}`}>{isbn}</div>
        <div className={`relative ${altWidth}`}>{publisher}</div>
        <div className={`relative ${altWidth}`}>{releaseDate}</div>
        <div className={`relative ${altWidth}`}>{copies} of {copies} available</div>
      </div>
    </div>
  );
};

export default BookDetail;
