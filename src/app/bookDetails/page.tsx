"use client";
import React from "react";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
import bookIcon from "./bookmark_add.svg";
import Tag from "@/components/tag";
import BookDetail from "@/components/details";
import placeHolder from "./placeholder.jpg";

const BookDetails = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };

// TODO: make not static!!!
  const book = {
    title: "STORY OF AVA AND HANNAH",
    author: "Jenn and Clarence",
    tags: ["Non-Fiction", "Adventure", "Bestseller"],
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.`,
    image: placeHolder,
    details: {
      ISBN: "123-456-789",
      Publisher: "English At Large",
      Release: "January 1, 2024",
      Copies: "10",
    },
  };

  return (
    <div>
      <div className="flex row-span-2 content-center justify-between">
        <div className="relative my-20 mx-40">
          <div className="text-3xl font-[family-name:var(--font-rubik)] font-semibold">
            {book.title}
          </div>
          <div className="mb-32 font-[family-name:var(--font-rubik)]">
            by {book.author}
          </div>
          <CommonButton
            label="Borrow"
            onClick={handleClick}
            altStyle="w-40 h-10 bg-[#202D74] pl-10 text-sm"
            icon={
              <Image src={bookIcon} alt="Book Icon" className="w-4 h-4 mr-3" />
            }
          />
        </div>
        <div className="relative my-20 mx-40 font-[family-name:var(--font-rubik)]">
        <Image
            src={book.image}
            alt="Book Cover"
            width={150}
            height={200}
          />
        </div>
      </div>

      <hr className="h-px bg-[#D4D4D4] border-0 mx-40 -mt-10"></hr>

      {/* Tags Section */}
      <div className="relative mt-10 mx-40">
        <div className="font-semibold font-[family-name:var(--font-rubik)] text-lg">
          Tags
        </div>
        <div className="flex mt-2">
          {book.tags.map((tag, index) => (
            <Tag key={index} label={tag} />
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="relative mt-10 mx-40">
        <div className="font-semibold font-[family-name:var(--font-rubik)] text-lg">
          Description
        </div>
        <div className="mt-5 font-[family-name:var(--font-rubik)]">
          {book.description}
        </div>
      </div>

      {/* Details Section */}
      <div className="relative mt-10 mx-40">
        <div className="font-semibold font-[family-name:var(--font-rubik)] text-lg">
          Details
        </div>
        <div className="mt-5 font-[family-name:var(--font-rubik)]">
          <BookDetail label="ISBN" value={book.details.ISBN} />
          <BookDetail label="Publisher" value={book.details.Publisher} />
          <BookDetail label="Release" value={book.details.Release} />
          <BookDetail label="Copies" value={book.details.Copies} />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
