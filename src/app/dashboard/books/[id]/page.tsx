"use client";
import React, { useEffect, useState, use } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
import bookmark from "@/assets/icons/Bookmark.svg";
import pencil from "@/assets/icons/Pencil.svg";
import trash from "@/assets/icons/Trash.svg";
import Tag from "@/components/tag";
import BookDetail from "@/components/details";
import { getOneBook } from "@/lib/api/books";
import { Book } from "@prisma/client";
import BookForm from "@/components/common/forms/BookForm";
import RemoveModal from "@/components/RemoveModal";
import imageToAdd from "../../../../assets/images/harry_potter.jpg"

type Params = Promise<{ id: string }>;

/**
 *
 * @param props - found the URL
 * @returns the book details page
 * @notes uses Next.js 15's asynchronous pages. find out more here:
 * https://nextjs.org/docs/app/building-your-application/upgrading/version-15#asynchronous-page
 */
const BookDetails = (props: { params: Promise<Params> }) => {
  const params = use(props.params);
  const [book, setBook] = useState<Book | null>(null);
  // const [imageSrc, setImageSrc] = useState<string>(imageToAdd.src);
  const [showBookForm, setShowBookForm] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const book = await getOneBook(+(await params).id);
      setBook(book || null);
    };
    fetchBook();
  }, [params]);

  const handleClick = () => {
    alert("Button clicked!");
  };

  if (book === null) return null;

  return (
    <div>
      {showBookForm ? (
        <BookForm
          setShowBookForm={setShowBookForm}
          existingBook={book}
          onSave={(b: Book | null) => {
            setBook(b);
          }}
        />
      ) : (
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
                    <div className="flex">
                      <CommonButton
                        label="Borrow"
                        onClick={handleClick}
                        altStyle="w-40 h-10 bg-[#202D74] border-none mr-3"
                        altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold -ml-2"
                        leftIcon={
                          <Image
                            src={bookmark}
                            alt="Book Icon"
                            className="w-4 h-4 mr-3"
                          />
                        }
                      />
                      <CommonButton
                        label="Edit"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowBookForm(true);
                        }}
                        altStyle="w-40 h-10 bg-[#202D74] border-none mr-3"
                        altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold -ml-2"
                        leftIcon={
                          <Image
                            src={pencil}
                            alt="Pencil Icon"
                            className="w-4 h-4 mr-3"
                          />
                        }
                      />
                      <CommonButton
                        label="Remove"
                        onClick={() => {
                          setShowRemoveModal(true);
                        }}
                        altStyle="w-40 h-10 bg-[#EC221F] border-none mr-3"
                        altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold -ml-2"
                        leftIcon={
                          <Image
                            src={trash}
                            alt="Book Icon"
                            className="w-4 h-4 mr-3"
                          />
                        }
                      />
                      {showRemoveModal && (
                        <RemoveModal
                          setShowRemoveModal={setShowRemoveModal}
                          book={book}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-10 mr-10 w-[200px] h-[300px] flex justify-center items-center">
                  <Image
                  src={book.coverURL || imageToAdd.src}
                  alt="Book Cover"
                  width={200}
                  height={300}
                  className="w-full h-full object-fill"
                />
                </div>
              </div>

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
                    numPages={book.numPages}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BookDetails;
