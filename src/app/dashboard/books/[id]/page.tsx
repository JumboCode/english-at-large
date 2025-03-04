"use client";
import React, { useEffect, useState, use } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
// import bookIcon from "../../../../assets/icons/bookmark_add.svg";
import bookIconGreyed from "../../../../assets/icons/bookmark_add_greyed_out.svg";
import holdBookClock from "../../../../assets/icons/holdBookClock.svg"
import BorrowPopup from "@/components/common/BorrowPopup";
import HoldPopup from "@/components/common/HoldPopup";
import { getOneBook } from "@/lib/api/books";
import { Book, RequestStatus, BookRequest, User } from "@prisma/client";
import pencil from "@/assets/icons/Pencil.svg";
import trash from "@/assets/icons/Trash.svg";
import Tag from "@/components/tag";
import BookDetail from "@/components/Details";
import BookForm from "@/components/BookForm";
import RemoveModal from "@/components/RemoveModal";
import imageToAdd from "../../../../assets/images/harry_potter.jpg";
import { getUserRequests } from "@/lib/api/requests";
import { MAX_REQUESTS } from "@/lib/util/types";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

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
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [isHoldOpen, setIsHoldOpen] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [userLoans, setUserLoans] = useState<
      (BookRequest & { user: User; book: Book })[]
    >([]);
  const [userHolds, setUserHolds] = useState<
      (BookRequest & { user: User; book: Book })[]
    >([]);
  const user = useCurrentUser();
  const { hidePopup, popupStatus } = usePopup();
  const [borrowed, setBorrowed] = useState(false);
  const [holdPlaced, setHoldPlaced] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const book = await getOneBook(+(await params).id);
      setBook(book || null);
    };
    fetchBook();
  }, [params]); 

  useEffect(() => {
    if (user && book) {
      const fetchRequests = async () => {
        const allUserRequests = await getUserRequests(user.id);
        const userLoans = (allUserRequests ?? []).filter(request => 
          request.status === RequestStatus.Borrowed
        );
        const userHolds = (allUserRequests ?? []).filter(request => 
          request.status === RequestStatus.Hold
        );

        setUserLoans(userLoans);
        setUserHolds(userHolds);

        // checking if user has already borrowed or placed hold 
        //  for the current book
        const isBookLoaned = userLoans.some(request => request.bookId === book.id);
        const isBookHeld = userHolds.some(request => request.bookId === book.id);
        if (isBookLoaned) {
          setBorrowed(true); 
        } 
        if (isBookHeld) {
          setHoldPlaced(true); 
        } 
      }
      fetchRequests(); 
    }
  }, [user, book]);


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
          exit={() => setShowBookForm(false)}
          existingBook={book}
          onSave={(b: Book | null) => {
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
                          label= {
                            book.availableCopies > 0 
                            ? userLoans.length < MAX_REQUESTS
                              ? borrowed
                                ? "Borrowed"
                                : "Borrow"
                              : "Loans exceeded"
                            : userHolds.length < MAX_REQUESTS
                                ? holdPlaced
                                    ? "Hold placed"
                                    : "Place hold"
                                : "Holds exceeded"
                          }
                          altStyle={`w-40 h-10 ${
                            userLoans.length >= MAX_REQUESTS || userHolds.length >= MAX_REQUESTS
                            || borrowed || holdPlaced
                              ? "bg-medium-grey-border"
                              : "bg-dark-blue"
                          } border-none mr-3`}
                          onClick={
                            book.availableCopies > 0 
                            ? userLoans.length < MAX_REQUESTS && !borrowed
                              ? toggleBorrowOpen
                              : undefined
                            : userHolds.length < MAX_REQUESTS && !holdPlaced
                                ? toggleHoldOpen
                                : undefined
                          }
                          altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold -ml-2"
                          leftIcon={
                            borrowed || holdPlaced 
                            ? undefined
                            : <Image
                              src={
                                book.availableCopies > 0 
                                ? bookIconGreyed
                                : holdBookClock
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
                    copies={book.copies}
                    numPages={book.numPages}
                    availableCopies={book.availableCopies}
                    lineSpacing="space-y-6"
                  />
                </div>
              </div>

              {isBorrowOpen ? (
                <BorrowPopup toggleOpen={toggleBorrowOpen} book={book} />
              ) : null}

              {isHoldOpen ? (
                <HoldPopup toggleOpen={toggleHoldOpen} book={book} />
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
