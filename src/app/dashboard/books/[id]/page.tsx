"use client";
import React, { useEffect, useState, use, useMemo } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
import bookIcon from "../../../../assets/icons/bookmark_add.svg";
import holdBookClock from "../../../../assets/icons/holdBookClock.svg";
import BookPopup from "@/components/common/BookPopUp";
import { getOneBook } from "@/lib/api/books";
import pencil from "@/assets/icons/Pencil.svg";
import trash from "@/assets/icons/Trash.svg";
import Tag from "@/components/tag";
import BookDetail from "@/components/Details";
import BookForm from "@/components/BookForm";
import RemoveModal from "@/components/RemoveModal";
import imageToAdd from "../../../../assets/images/harry_potter.jpg";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import { BookWithRequests, getAvailableCopies } from "@/lib/util/types";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import { useRouter } from "next/navigation";

type Params = Promise<{ id: string }>;

/**
 *
 * @param props - found the URL
 * @returns the book details page
 * @notes uses Next.js 15's asynchronous pages. find out more here:
 * https://nextjs.org/docs/app/building-your-application/upgrading/version-15#asynchronous-page
 *
 * TODO: Hook up the availability logic again once schema changes are pushed
 */
const BookDetails = (props: { params: Promise<Params> }) => {
  const params = use(props.params);
  const [book, setBook] = useState<BookWithRequests | null>(null);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [isHoldOpen, setIsHoldOpen] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const user = useCurrentUser();
  const { hidePopup, popupStatus } = usePopup();

  const router = useRouter();
  useEffect(() => {
    const fetchBook = async () => {
      const book = await getOneBook(+(await params).id);
      if (!book) {
        router.replace("/dashboard");
      }
      setBook(book || null);
    };
    fetchBook();
  }, [params, router]);

  const availableCopies = useMemo(
    () => (book ? getAvailableCopies(book) : 0),
    [book]
  );

  const toggleBorrowOpen = () => {
    setIsBorrowOpen(!isBorrowOpen);
  };

  const toggleHoldOpen = () => {
    setIsHoldOpen(!isHoldOpen);
  };

  if (book === null) return null;

  return (
    <div>
      {showBookForm ? (
        <BookForm
          exit={(show: boolean) => setShowBookForm(show)}
          existingBook={book}
          onSave={(b: BookWithRequests | null) => {
            setBook(b);
          }}
          isbn={book.isbn[0]}
        />
      ) : (
        <div className="pb-12">
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
                      {
                        <CommonButton
                          label={availableCopies > 0 ? "Borrow" : "Place Hold"}
                          altStyle={`w-40 h-10 bg-dark-blue border-none mr-3`}
                          onClick={
                            availableCopies > 0
                              ? toggleBorrowOpen
                              : toggleHoldOpen
                          }
                          altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold -ml-2"
                          leftIcon={
                            <Image
                              src={
                                availableCopies > 0 ? bookIcon : holdBookClock
                              }
                              alt="Book Icon"
                              className="w-4 h-4 mr-3"
                            />
                          }
                        />
                      }

                      {user?.role === "Admin" ? (
                        <>
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
                        </>
                      ) : null}
                      {showRemoveModal ? (
                        <RemoveModal
                          book={book}
                          setShowRemoveModal={setShowRemoveModal}
                        />
                      ) : null}
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
                  {book.level ? <Tag label={book.level} /> : null}
                  {book.bookType ? <Tag label={book.bookType} /> : null}
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
                    isbn={book.isbn.length !== 0 ? book.isbn : ["None"]}
                    publisher={book.publisher ? book.publisher : "None"}
                    releaseDate={book.releaseDate ? book.releaseDate : "None"}
                    copies={book.copies}
                    numPages={book.numPages}
                    availableCopies={availableCopies}
                    lineSpacing="space-y-6"
                  />
                </div>
              </div>

              {isBorrowOpen ? (
                <BookPopup
                  toggleOpen={toggleBorrowOpen}
                  book={book}
                  borrow={true}
                />
              ) : null}

              {isHoldOpen ? (
                <BookPopup
                  toggleOpen={toggleHoldOpen}
                  book={book}
                  borrow={false}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      )}
      {popupStatus.shown ? (
        <ConfirmationPopup
          type={popupStatus.type}
          action={popupStatus.action}
          success={popupStatus.success}
          onDisappear={() => hidePopup()}
          custom={popupStatus.custom}
        />
      ) : null}
    </div>
  );
};

export default BookDetails;
