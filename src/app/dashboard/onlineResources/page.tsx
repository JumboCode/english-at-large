"use client";
import React from "react";
import { useState, useEffect } from "react";
import { BookLevel, BookSkills, BookStatus } from "@prisma/client";
import SearchBar from "@/components/SearchBar";
import FilterPopup from "@/components/common/FilterPopup";
import BookForm from "@/components/BookForm";
import CommonButton from "@/components/common/button/CommonButton";
import FilterIcon from "@/assets/icons/Filter";
import AddIcon from "@/assets/icons/Add";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";

const OnlineResourcesPage = () => {
  const user = useCurrentUser();

  // TODO: turn this into resource form
  const [bookFormShown, setBookFormShown] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [skills, setSkills] = useState<BookSkills[]>([]);
  const [levels, setLevels] = useState<BookLevel[]>([]);
  const [status, setStatus] = useState<BookStatus[]>([]);
  const [bookSortBy, setBookSortBy] = useState<string>("By Title");

  const { hidePopup, popupStatus } = usePopup();

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  //   const filterBooks = useCallback(
  //     (book: Book) => {
  //       return (
  //         (skills.length === 0 ||
  //           skills.some((skill) => book.skills.includes(skill))) &&
  //         (levels.length === 0 || levels.includes(book.level))
  //       );
  //     },
  //     [levels, skills]
  //   );

  //   const sortBooks = useCallback(
  //     (a: Book, b: Book) => {
  //       if (bookSortBy === "By Title") {
  //         return (
  //           a.title.localeCompare(b.title) || a.author.localeCompare(b.author)
  //         );
  //       } else if (bookSortBy === "By Author") {
  //         return (
  //           a.author.localeCompare(b.author) || a.title.localeCompare(b.title)
  //         );
  //       } else if (bookSortBy === "By Release Date") {
  //         return (a.releaseDate || 0) < (b.releaseDate || 0) ? -1 : 1;
  //       }
  //       return 0;
  //     },
  //     [bookSortBy]
  //   );

  //   const subsetBooks = structuredClone(books)
  //     .filter(
  //       (book) =>
  //         book.title.toLowerCase().includes(searchData) ||
  //         book.author.toLowerCase().includes(searchData) ||
  //         book.isbn.includes(searchData)
  //     )
  //     .sort((a, b) => sortBooks(a, b))
  //     .filter((book) => filterBooks(book));

  useEffect(() => {
    const fetchData = async () => {
      try {
        //TODO: fetch online resources
      } catch (err) {
        console.error("Failed to get all online resources");
      }
    };
    fetchData();
  }, []);

  return bookFormShown ? (
    <BookForm exit={() => setBookFormShown(false)} existingBook={null} />
  ) : (
    <div>
      <SearchBar
        setSearchData={() => {}} // TODO: fill this in
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
              label="Add Resource"
              leftIcon={<AddIcon />}
              onClick={() => setBookFormShown(true)}
              altTextStyle="text-white"
              altStyle="bg-dark-blue"
            />
          ) : null
        }
        placeholderText="Search for resources"
      />
      <div className="text-center">Coming soon!</div>
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
        status={status}
        setStatus={setStatus}
        sortBook={bookSortBy}
        setSortBook={setBookSortBy}
      />
    </div>
  );
};

export default OnlineResourcesPage;
