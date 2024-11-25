"use client";
import React, { useRef } from "react";
import SearchIcon from "../assets/icons/Search";

interface searchBarProps {
  button: React.ReactNode;
  button2 ?: React.ReactNode;
  placeholderText: string;
}

const SearchBar = (props: searchBarProps) => {
  const { button, button2, placeholderText } = props;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const clickBar = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
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
          placeholder={placeholderText}
        />
        <SearchIcon />
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
