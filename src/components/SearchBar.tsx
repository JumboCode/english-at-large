"use client";
import React, { useRef } from "react";
import SearchIcon from "../assets/icons/Search";
import FilterIcon from "../assets/icons/Filter";
import CreateBookButton from "./about/CreateBookButton";

const SearchBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const clickBar = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-row gap-6 items-center min-w-full justify-between px-16 py-6 bg-white border border-light-grey-border border-l-0 border-r-0">
      <div
        className="flex flex-row justify-between items-center px-4 py-3 w-full min-w-max border border-medium-grey-border rounded-lg bg-white cursor-text"
        onClick={clickBar}
      >
        <input
          ref={searchInputRef}
          className="w-full focus:outline-none text-black placeholder-medium-grey-border text-base"
          name="search bar"
          placeholder="Search for books"
        />
        <SearchIcon />
      </div>
      <div className="flex flex-row items-center gap-3">
        <button className="flex flex-row items-center gap-2 p-3 min-w-max border rounded-lg border-dark-blue bg-white">
          <FilterIcon />
          <p className="text-dark-blue text-sm">Filter</p>
        </button>
        <CreateBookButton />
      </div>
    </div>
  );
};

export default SearchBar;
