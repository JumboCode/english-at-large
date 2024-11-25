"use client";
import React, { useRef, useState, useMemo } from "react";
import SearchIcon from "../assets/icons/Search";
import { Book, BookSkills, BookLevel, BookStatus } from "@prisma/client";

interface searchBarProps {
  setFilteredBooks: (book: Book[]) => void
  setSearchData: (searchData: string) => void
  button: React.ReactNode;
  button2: React.ReactNode;
  placeholderText: string;
  books: Book[]
  onClick: () => void
}

const SearchBar = (props: searchBarProps) => {
  const { setFilteredBooks, setSearchData, button, button2, placeholderText, books, onClick } = props;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const clickBar = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  function handleKeyDown(event: { key: string; }) {
    if (event.key === "Enter") {
      onClick();
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchData(value.toLowerCase());
  };

  return (
    <div className="flex flex-row gap-6 items-center min-w-full justify-between px-16 py-6 bg-white">
      <div
        className="flex flex-row justify-between items-center px-4 py-[10px] w-full min-w-max border border-medium-grey-border rounded-lg bg-white cursor-text"
        onClick={clickBar}
      >
        <input
          ref={searchInputRef}
          className="w-full focus:outline-none text-black placeholder-medium-grey-border text-base"
          name="search bar"
          onChange={handleInputChange}
          onKeyDown= {handleKeyDown}
          placeholder={placeholderText}
        />
        <button onClick={onClick}>
          <SearchIcon />
        </button>
      </div>
      <div className="flex flex-row items-center gap-3">
        {button}
        {button2}
      </div>
    </div>
  );
};
/*Lifting state up of showBookForm */

export default SearchBar;
