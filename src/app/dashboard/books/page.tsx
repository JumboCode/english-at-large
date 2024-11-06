"use client";
import React, { useCallback, useMemo } from "react";
import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/api/books";
import { Book, BookLevel, BookSkills, BookStatus } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import SearchBar from "@/components/SearchBar";
import FilterPopup from "@/components/common/FilterPopup";
import AddNewBookForm from "@/components/common/forms/AddNewBookForm";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookFormShown, setBookFormShown] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [skills, setSkills] = useState<BookSkills[]>([]);
  const [levels, setLevels] = useState<BookLevel[]>([]);
  const [status, setStatus] = useState<BookStatus[]>([]);
  const [bookSortBy, setBookSortBy] = useState<string>("By Title");

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filterBooks = useCallback(
    (book: Book) => {
      return (
        (skills.length === 0 ||
          skills.some((skill) => book.skills.includes(skill))) &&
        (levels.length === 0 || levels.includes(book.level))
      );
    },
    [levels, skills]
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
        // Sort by release date, treating undefined dates as less recent
        return (a.releaseDate || 0) < (b.releaseDate || 0) ? -1 : 1;
      }
      return 0;
    },
    [bookSortBy]
  );

  const filteredBooks = useMemo(() => {
    return [...books] // Create a shallow copy to avoid mutating the original `books` array
      .sort((a, b) => sortBooks(a, b)) // Use the sortBooks function to compare and sort
      .filter((book) => filterBooks(book)); // Use filterBooks to filter out the books
  }, [books, filterBooks, sortBooks]);

  const fetchData = useCallback(async () => {
    try {
      const allBooks = await getAllBooks();
      if (allBooks) {
        setBooks(allBooks);
      }
    } catch (err) {
      console.error("Failed to get all books");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <SearchBar
        filterOnPress={toggleFilterPopup}
        setShowBookForm={setBookFormShown}
      />

      {bookFormShown ? (
        <AddNewBookForm
          setShowBookForm={setBookFormShown}
          onBookAdded={fetchData}
        />
      ) : null}
      <FilterPopup
        isOpen={isFilterOpen}
        toggle={toggleFilterPopup}
        skills={skills}
        setSkills={setSkills}
        levels={levels}
        setLevels={setLevels}
        status={status}
        setStatus={setStatus}
        sortBook={bookSortBy}
        setSortBook={setBookSortBy}
      />
      <div className="p-4 bg-gray-100">
        <div className="text-left">
          <div className="whitespace-normal">
            <p className="text-sm text-slate-500">
              {filteredBooks.length} {"titles"}
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBooks.map((book, index) => (
            <li key={index}>
              <div>
                <div className="p-4 bg-white shadow-md rounded-md hover:bg-blue-100 transition duration-200">
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
