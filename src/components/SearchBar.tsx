"use client";
import React, { useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { MdOutlineTune } from "react-icons/md";

const SearchBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const clickBar = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-row gap-4 items-center min-w-full justify-between">
      <div
        className="flex flex-row justify-between items-center px-5 py-3 w-full min-w-max border border-grey-800 rounded-full bg-white cursor-text"
        onClick={clickBar}
      >
        <input
          ref={searchInputRef}
          className="w-full focus:outline-none text-black"
          name="search bar"
          placeholder="Search for books"
        />
        <CiSearch className=" text-black stroke-current stroke-1 " />
      </div>
      <div className="flex flex-row items-center gap-4">
        <button className="flex flex-row items-center gap-2 p-3 min-w-max border rounded-lg border-blue-900 bg-white">
          <MdOutlineTune className="text-blue-900 stroke-current" />
          <p className="text-blue-900">Filter</p>
        </button>
        <button className="flex flex-row items-center gap-2 min-w-max p-3 rounded-lg border border-blue-900 bg-blue-900">
          <FiPlus />
          <p>Add new</p>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
