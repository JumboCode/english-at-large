"use client";
import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/api/books";
import { Book, BookLevel, BookSkills } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import SearchBar from "@/components/SearchBar";
import FilterPopup from "@/components/common/FilterPopup";
import IsbnPopup from "@/components/common/forms/IsbnPopup";
import CommonButton from "@/components/common/button/CommonButton";
import FilterIcon from "@/assets/icons/Filter";
import AddIcon from "@/assets/icons/Add";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import LoadingSkeleton from "./loading";
import SimilarBookPopup from "@/components/common/forms/SimilarBookPopup";
import BookForm from "@/components/BookForm";
import { emptyBook } from "@/lib/util/types";

enum formState {
  FORM_CLOSED,
  ISBN_FORM_OPEN,
  BOOK_FORM_OPEN,
  SIMILAR_BOOK_FORM_OPEN,
}

// const fetchBooks = async () => {
//   const books = await getAllBooks();
//   return books;
// };
// const booksPromise = getAllBooks();

const BooksPage = () => {
  // const books = use(booksPromise);
  const user = useCurrentUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const [formShown, setFormShown] = useState<formState>(formState.FORM_CLOSED);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [skills, setSkills] = useState<BookSkills[]>([]);
  const [levels, setLevels] = useState<BookLevel[]>([]);
  const [bookAvailable, setBookAvailable] = useState<boolean>(true);
  const [bookSortBy, setBookSortBy] = useState<string>("By Title");
  const [isbnOnSubmit, setISBN] = useState<string>("");

  const { hidePopup, popupStatus } = usePopup();
  const [searchData, setSearchData] = useState("");

  // states for the similar books popup
  const [foundBookList, setFoundBookList] = useState<Book[]>([]);
  const [originalBook, setOriginalBook] = useState<Omit<Book, "id">>(emptyBook);

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filterBooks = useCallback(
    (book: Book) => {
      return (
        (skills.length === 0 ||
          skills.some((skill) => book.skills.includes(skill))) &&
        (levels.length === 0 || levels.includes(book.level)) &&
        // (status.length == 0 || status.includes(book.status)) TODO: replace filter logic
        bookAvailable
      );
    },
    [levels, skills, bookAvailable]
  );

  const sortBooks = useCallback(
    (a: Book, b: Book) => {
      if (bookSortBy === "By Title") {
        return (
          a.title.localeCompare(b.title) || a.author.localeCompare(b.author)
        );
      } else if (bookSortBy === "By Author") {
        return (
          a.author.localeCompare(b.author) || a.title.localeCompare(b.title)
        );
      } else if (bookSortBy === "By Release Date") {
        return (a.releaseDate || 0) < (b.releaseDate || 0) ? -1 : 1;
      }
      return 0;
    },
    [bookSortBy]
  );

  // use of structured clone creates new subset of search target books
  // allows filter to act on subset of searched books

  const subsetBooks = structuredClone<Book[]>(books)
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchData) ||
        book.author.toLowerCase().includes(searchData) ||
        book.isbn.some((isbn) => isbn.includes(searchData))
    )
    .sort((a, b) => sortBooks(a, b))
    .filter((book) => filterBooks(book));

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBooks(true);
      try {
        const allBooks = await getAllBooks();
        if (allBooks) {
          setBooks(allBooks.books);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error("Failed to get all books", err);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchData();
  }, []);

  const bookFormExit = (listLen: boolean) => {
    setFormShown(
      listLen ? formState.SIMILAR_BOOK_FORM_OPEN : formState.FORM_CLOSED
    );
  };

  return formShown == formState.BOOK_FORM_OPEN ? (
    <BookForm
      exit={bookFormExit}
      existingBook={null}
      isbn={isbnOnSubmit ?? undefined}
      setOriginalBook={setOriginalBook}
      setBookList={setFoundBookList}
    />
  ) : (
    <div>
      <IsbnPopup
        isOpen={formShown == formState.ISBN_FORM_OPEN}
        exit={() => setFormShown(formState.BOOK_FORM_OPEN)}
        submit={(isbn: string) => {
          setFormShown(formState.BOOK_FORM_OPEN);
          setISBN(isbn);
        }}
      />
      <SimilarBookPopup
        originalBook={originalBook}
        isOpen={formShown == formState.SIMILAR_BOOK_FORM_OPEN}
        exit={() => setFormShown(formState.FORM_CLOSED)}
        bookList={foundBookList}
      />
      <SearchBar
        setSearchData={setSearchData}
        button={
          <CommonButton
            label="Filter"
            leftIcon={<FilterIcon />}
            onClick={toggleFilterPopup}
          />
        }
        button2={
          user?.role === "Admin" ? (
            <CommonButton
              label="Create Book"
              leftIcon={<AddIcon />}
              onClick={() => setFormShown(formState.ISBN_FORM_OPEN)}
              altTextStyle="text-white"
              altStyle="bg-dark-blue"
            />
          ) : null
        }
        placeholderText="Search for books"
      />

      {popupStatus.shown ? (
        <ConfirmationPopup
          type={popupStatus.type}
          action={popupStatus.action}
          success={popupStatus.success}
          onDisappear={() => hidePopup()}
          custom={popupStatus.custom}
        />
      ) : null}

      <FilterPopup
        isOpen={isFilterOpen}
        toggle={toggleFilterPopup}
        skills={skills}
        setSkills={setSkills}
        levels={levels}
        setLevels={setLevels}
        bookAvailable={bookAvailable}
        setBookAvailable={setBookAvailable}
        sortBook={bookSortBy}
        setSortBook={setBookSortBy}
      />

      <div className="p-4 px-16 bg-white border-t">
        <div className="text-left">
          <div className="whitespace-normal">
            <p className="text-sm text-slate-500 mb-6">
              {subsetBooks.length} {"titles"}
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingBooks
            ? // placeholders while books are loading
              Array.from({ length: 4 }).map((_, index) => (
                <li key={index}>
                  <div className="p-4 border-gray-200 border bg-white shadow-md rounded-md h-[40vh]">
                    <LoadingSkeleton />
                  </div>
                </li>
              ))
            : subsetBooks.map((book, index) => (
                <li key={index}>
                  <div>
                    <div className="p-4 border-gray-200 border bg-white shadow-md rounded-md hover:bg-blue-100 transition duration-200">
                      <BookInfo book={book} />
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
 };

export default BooksPage;
