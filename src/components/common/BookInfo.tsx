"use client";
import React from "react";
import { Book } from "@prisma/client"
import imageToAdd from "../../assets/images/harry_potter.jpg";
import Image from "next/image"

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

  const image = 
    <Image 
    src ={imageToAdd} 
    style={{ width: '200px', height: 'auto' }}  
    alt="Image" 
    />;

  // if icon isn't passed in, nothing will show
  //{image}
  return (
    <div>
      <button onClick={click} className="flex items-start space-x-4">
        <div className = "flex flex-wrap">{image}</div>
        <div>
          
          <div className="text-left mt-4 mb-4 ml-4 mr-4">
            <h3 className="text-lg text-black font-semibold">{book.title}</h3>
            <p className="text-sm text-black">{"by"} {book.author} </p>
          </div>
         
          <div className="grid grid-cols-2 gap-4">
            <div className = "flex flex-wrap gap-4 mt-2">
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <text>{book.booktype}</text>
              </div>
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <text>{book.level.replace("_", " ")}</text>
              </div>
              <div className="flex flex-wrap gap-4">
                  {book.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center"
                    >
                      {skill.replace("_", " ")}
                    </div>
                  ))}
              </div>
            </div>
            
          </div>
        </div>
      </button>
    </div>
  );
};

export default BookInfo;
