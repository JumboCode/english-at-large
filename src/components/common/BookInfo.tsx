"use client";
import React from "react";
import { Book } from "@prisma/client"
//import imageToAdd from "../../assets/images/harry_potter.jpg";
//import Image from "next/image"

interface BookProps {
    book: Book
}

/**
 * Our internal button component which includes options for icons and adheres to our own styling system.
 * @param props: label
 * @param optional props: left/right icons, alternate Tailwind classes for the text and the
 * @returns a React Components.
 * @TODO: add in loading components
 */
const BookInfo = (props: BookProps) => {
  const {
    book
  } = props;

  const click = () => {
    console.log("click");
  }

  //const image = <Image src ={imageToAdd}  alt="Image" className="object-cover"/>;

  // if icon isn't passed in, nothing will show
  //{image}
  return (
    <div>
      <button onClick={click}>
        {book.title}
        {book.author}
        {book.isbn}
        
      </button>
    </div>
  );
};

export default BookInfo;
