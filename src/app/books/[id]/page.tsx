"use client";
import React, { useEffect, useState } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
import bookIcon from "./bookmark_add.svg";
import Tag from "@/components/tag";
import BookDetail from "@/components/details";
import { getOneBook } from "@/lib/api/books";
import { Book } from "@prisma/client";

const BookDetails = ({ params }: { params: { id: string } }) => {
  console.log(params);
  const [book, setBook] = useState<Book | null>(null);

  //   const placeHolderBook = {
  //     title: "STORY OF AVA AND HANNAH",
  //     author: "Jenn and Clarence",
  //     skills: ["Non-Fiction", "Adventure", "Bestseller"],
  //     description: `Once there was a girl named Hannah. But actually 4 days earlier
  //         there was a girl named Ava. And they both lived in the greater Philly area but
  //         didn't know each other until college! What a small world.`,
  //     image: placeHolder,
  //     details: {
  //       isbn: "123-456-789",
  //       publisher: "English At Large",
  //       releaseDate: "January 1, 2024",
  //       copies: "10",
  //     },
  //   };

  useEffect(() => {
    const fetchBook = async () => {
      const book = await getOneBook(+params.id);
      console.log(book);
      setBook(book || null);
    };
    fetchBook();
  }, [params.id]);

  const handleClick = () => {
    alert("Button clicked!");
  };

  if (book === null) return null;

  return (
    <div>
      {book ? (
        <div>
          <div className="grid grid-rows-1 grid-flow-col xs:grid-rows-2">
            <div className="flex content-center">
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
                  altStyle="w-40 h-10 bg-[#202D74] pl-10"
                  altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold -ml-2"
                  leftIcon={
                    <Image
                      src={bookIcon}
                      alt="Book Icon"
                      className="w-4 h-4 mr-3"
                    />
                  }
                />
              </div>
            </div>

            <div className="flex justify-end my-20 mr-40 font-[family-name:var(--font-rubik)]">
              {/* <Image
                src={placeHolder}
                alt="Book Cover"
                width={150}
                height={190}
                style={imageStyle}
              /> */}
              <div className="bg-gray-500 w-[150px] h-[190px]"> </div>
            </div>
          </div>

          <hr className="h-px bg-[#D4D4D4] border-0 mx-40 -mt-10"></hr>

          {/* Tags Section */}
          <div className="relative mt-10 mx-40">
            <div className="font-semibold font-[family-name:var(--font-rubik)] text-lg">
              Tags
            </div>
            <div className="flex mt-2">
              {book.skills.map((skill, index) => (
                <Tag key={index} label={skill} />
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
              <BookDetail
                isbn={book.isbn}
                publisher={book.publisher}
                releaseDate={book.releaseDate}
                copies={10}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookDetails;
