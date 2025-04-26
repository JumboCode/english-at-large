"use client";
import React, { useEffect, useState, use, useMemo, useCallback } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import Image, { StaticImageData } from "next/image";
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
import imageToAdd from "../../../../assets/images/Placeholder_Book_Cover.png";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import {
  BookWithRequests,
  getAvailableCopies,
  getUserBookStatus,
  UserBookStatus,
} from "@/lib/util/types";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
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

interface ButtonConfig {
  label: string;
  style: string;
  icon: StaticImageData;
  onClick: () => void;
}
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
      try {
        const book = await getOneBook(+(await params).id);
        if (!book) {
          router.replace("/dashboard");
        } else {
          setBook(book);
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        router.replace("/dashboard");
      }
    };
    fetchBook();
  }, [params, router]);

  const availableCopies = useMemo(
    () => (book ? getAvailableCopies(book) : 0),
    [book]
  );

  const toggleBorrowOpen = useCallback(() => {
    setIsBorrowOpen(!isBorrowOpen);
  }, [isBorrowOpen]);

  const toggleHoldOpen = useCallback(() => {
    setIsHoldOpen(!isHoldOpen);
  }, [isHoldOpen]);

  const userBookStatus: UserBookStatus = useMemo(() => {
    return getUserBookStatus(user?.requests, book?.id);
  }, [book?.id, user]);

  const buttonConfig: ButtonConfig = useMemo(() => {
    if (userBookStatus === UserBookStatus.HAS_BORROWED) {
      return {
        label: "Borrowed",
        style: "w-40 h-10 bg-gray-400 border-none mr-3",
        icon: null,
        onClick: () => {},
      };
    }

    if (userBookStatus === UserBookStatus.HAS_HOLD) {
      return {
        label: "Hold Placed",
        style: "w-40 h-10 bg-gray-400 border-none mr-3",
        icon: holdBookClock,
        onClick: () => {},
      };
    }

    if (availableCopies > 0) {
      return {
        label: "Borrow",
        style: "w-40 h-10 bg-dark-blue border-none mr-3",
        icon: bookIcon,
        onClick: toggleBorrowOpen,
      };
    } else {
      return {
        label: "Place Hold",
        style: "w-40 h-10 bg-dark-blue border-none mr-3",
        icon: holdBookClock,
        onClick: toggleHoldOpen,
      };
    }
  }, [userBookStatus, availableCopies, toggleBorrowOpen, toggleHoldOpen]);

  if (book === null) return null;

  if (!user) return;
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
                      {user?.role === UserRole.Admin ||
                      user?.role === UserRole.Volunteer ? (
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
                      ) : (
                        <CommonButton
                          label={buttonConfig.label}
                          altStyle={buttonConfig.style}
                          onClick={buttonConfig.onClick}
                          altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold -ml-2"
                          leftIcon={
                            !(
                              userBookStatus === UserBookStatus.HAS_HOLD ||
                              userBookStatus === UserBookStatus.HAS_BORROWED
                            ) ? (
                              <Image
                                src={
                                  availableCopies > 0 ? bookIcon : holdBookClock
                                }
                                alt="Book Icon"
                                className="w-4 h-4 mr-3"
                              />
                            ) : undefined
                          }
                          disabled={
                            userBookStatus === UserBookStatus.HAS_HOLD ||
                            userBookStatus === UserBookStatus.HAS_BORROWED
                          }
                        />
                      )}
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
                    releaseDate={book.releaseDate}
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
