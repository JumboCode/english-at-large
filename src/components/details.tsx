"use client";
import React from "react";

interface DetailProps {
  isbn: string;
  publisher: string;
  releaseDate: string | null;
  copies: number;
}

const BookDetail = (props: DetailProps) => {
  const { isbn, publisher, releaseDate, copies } = props;
  return (
    <div className="flex row-span-2 my-5">
      <div>
        <div className="relative text-gray-500 mr-4">ISBN</div>
        <div className="relative text-gray-500 mr-4">Publisher</div>
        <div className="relative text-gray-500 mr-4">Release</div>
        <div className="relative text-gray-500 mr-4">Copies</div>
      </div>
      <div>
        <div className="relative">{isbn}</div>
        <div className="relative">{publisher}</div>
        <div className="relative">{releaseDate}</div>
        <div className="relative">{copies}</div>
      </div>
    </div>
  );
};

export default BookDetail;
