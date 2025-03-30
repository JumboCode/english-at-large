"use client";
import { Book } from "@prisma/client";
import Image from "next/image";
import imageToAdd from "../../assets/images/harry_potter.jpg";
import Link from "next/link";

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

  return (
    <div>
      <Link
        href={`/dashboard/books/${book.id}`}
        className="grid grid-cols-[40%_60%] items-start"
      >
        <div className="w-[210px] h-[300px] object-fill">
          <Image
            src={book.coverURL || imageToAdd.src}
            alt="Book Cover"
            width={210}
            height={300}
            className="w-[210px] h-[300px]"
          />
        </div>

        <div className="align-middle">
          <div className="text-left mt-4 mb-4">
            <h3 className="text-lg text-black font-semibold">{book.title}</h3>
            <p className="text-sm text-black mt-2">
              {"by"} {book.author}{" "}
            </p>
          </div>

          <div className="flex flex-wrap items-start">
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <p>{book.bookType.replace("_", " ")}</p>
              </div>
              <div className="bg-white-200 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 flex items-center justify-start">
                <p>{book.level.replace("_", " ")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
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
      </Link>
    </div>
  );
};

export default BookInfo;
