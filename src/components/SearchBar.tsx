"use client";
import React, { useRef, useState, useEffect } from "react";
import SearchIcon from "../assets/icons/Search";

interface SearchBarProps {
  setSearchData: (searchData: string) => void;
  button: React.ReactNode;
  button2?: React.ReactNode;
  placeholderText: string;
  defaultValue?: string;
}

const SearchBar = ({
  setSearchData,
  button,
  button2,
  placeholderText,
  defaultValue = "",
}: SearchBarProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(defaultValue);

  useEffect(() => {
    setInput(defaultValue); // keep input in sync with parent
  }, [defaultValue]);

  const clickBar = () => {
    searchInputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
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
          value={input}
          placeholder={placeholderText}
        />
        <button>
          <SearchIcon />
        </button>
      </div>
      <div className="flex flex-row items-center gap-3 flex-shrink-0">
        {button}
        {button2}
      </div>
    </div>
  );
};

export default SearchBar;
