"use client";
import React, {useState, useEffect} from "react";
import { Book } from "@prisma/client";
// import { getBookCover } from "@/lib/api/books";
import axios from "axios";
import Image from "next/image";
import imageToAdd from "../../assets/images/harry_potter.jpg";

interface BookProps {
  book: Book;
}

/**
 * Our internal button component which includes options for icons and adheres to our own styling system.
 * @param props: label
 * @param optional props: left/right icons, alternate Tailwind classes for the text and the
 * @returns a React Components.
 * @TODO: add in loading components
 */
const BookInfo = (props: BookProps) => {
  const { book } = props;
  const [imageSrc, setImageSrc] = useState<string>(imageToAdd.src);

useEffect(() => {
  const setBookCover = async() => {  
    const url = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg?default=false`;
    try {
      const response = await axios.head(url);
      if (response.status == 200) {
        setImageSrc(url);
      }
    } catch (error) {
      setImageSrc(imageToAdd.src);
    }
  }
  setBookCover();
}, [book.isbn]);

  return (
    <div>
      <a href={`books/${book.id}`} className="flex items-start space-x-4">
      <div className="w-[200px] h-[300px] bg-gray-100 flex justify-center items-center">
        {imageSrc ? (
          <Image
          src={imageSrc}
          alt="Book Cover"
          width={200}
          height={300}
          className="object-contain"
        />
        ) : (
          <div></div>
        )}
        </div>       

        <div>
          <div className="text-left mt-4 mb-4 ml-4 mr-4">
            <h3 className="text-lg text-black font-semibold">{book.title}</h3>
            <p className="text-sm text-black">
              {"by"} {book.author}{" "}
            </p>
          </div>

          <div className="flex flex-wrap items-start space-x-4 ml-2">
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <p>{book.bookType}</p>
              </div>
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <p>{book.level.replace("_", " ")}</p>
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
      </a>
    </div>
  );
};

export default BookInfo;
