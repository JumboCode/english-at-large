"use client";
import React, {useState, useEffect} from "react";
import { Book } from "@prisma/client";
import imageToAdd from "../../assets/images/harry_potter.jpg";
import Image from "next/image";
import axios from 'axios';

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
  const getImage = async() => {  
    try {
      const url = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
      const response = await axios.get(`https://openlibrary.org/isbn/${book.isbn}.json`); 

      if (response.status === 200) {
        setImageSrc(url);
      }
    } catch (error) {
      setImageSrc(imageToAdd.src); 
    }
  }

  getImage();
}, [book.isbn]);

  return (
    <div>
      <a href={`books/${book.id}`} className="flex items-start space-x-4">
      <div className="flex justify-end font-[family-name:var(--font-rubik)]">
          <Image
            src={imageSrc}
            alt="Book Cover"
            width={200}
            height={300}
            className="object-cover" // Ensures the image maintains its aspect ratio
          />
        </div>
        {/* <Image
          src={}
          width={200}
          height={300}
          style={{ width: "200px", height: "auto" }}
          alt="Image"
        />  */}
        {/* <img 
        src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
        /> */}
        {/* <div className="w-200 h-200"> */}
      
        {/* { ? (
            <Image
            src={imageToAdd}
            style={{ width: "200px", height: "auto" }}
            alt="Image"
          /> 
          ) : ( */}
          {/* <div className="flex justify-end font-[family-name:var(--font-rubik)]">
            <img
              src={imageSrc}
              className="h-[200px]"
              // height={200}
              // width={150}
            />
          </div> */}
          {/* </div>
            <div className="flex justify-end my-4 mr-40 font-[family-name:var(--font-rubik)]">
              {/* TODO: This will be implemented once the books have images! */}
              {/* <Image
                src={TODO:}
                alt="Book Cover"
                width={150}
                height={190}
                style={imageStyle}
              /> */}
              {/* <div className="bg-gray-500 w-[150px] h-[200px]"> </div>
            </div> */}
          {/* )} */}
        {/* </div> */}

        

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
