"use client";
import React, { useRef } from "react";
import SearchIcon from "../assets/icons/Search";
import { useDebounce } from "@/lib/hooks/useDebounce";
import CloseIcon from "@/assets/icons/Close";

interface searchBarProps {
  setSearchData: ((searchData: string) => void) | null;
  button: React.ReactNode;
  button2?: React.ReactNode;
  placeholderText: string;
  manualSearch?: boolean;
}

const SearchBar = (props: searchBarProps) => {
  const { setSearchData, button, button2, placeholderText, manualSearch } =
    props;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localSearch, setLocalSearch] = React.useState<string>("");
  const debouncedSearch = useDebounce(localSearch, 300); // Debounce delay: 300ms
  const clickBar = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  React.useEffect(() => {
    if (!manualSearch && setSearchData) {
      setSearchData(debouncedSearch);
    }
  }, [debouncedSearch, manualSearch, setSearchData]);

  // may use this function later, also TODO: turn this into a useCallback
  // function handleKeyDown(event: { key: string }) {
  //   if (event.key === "Enter") {

  //   }
  // }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setLocalSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (manualSearch && e.key === "Enter" && setSearchData) {
      setSearchData(localSearch);
    }
  };

  const clearSearch = () => {
    setLocalSearch("");
    if (setSearchData) {
      setSearchData("");
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
          value={localSearch}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={clearSearch}
            className={`text-gray-400 text-sm ${
              localSearch ? "opacity-50" : "opacity-0"
            } hover:opacity-100 hover:text-gray-600 transition-opacity duration-200`}
            style={{ pointerEvents: localSearch ? "auto" : "none" }}
          >
            <CloseIcon className="w-[10px] h-[10px]" />
          </button>
          <button>
            <SearchIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-3 flex-shrink-0">
        {button}
        {button2}
      </div>
    </div>
  );
};

export default SearchBar;
