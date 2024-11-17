"use client";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import FilterIcon from "@/assets/icons/Filter";
import AddIcon from "@/assets/icons/Add";
import Link from "next/link";

/*
 * Home Page
 * ...it's the home page.
 * eventually where the database will be at, depending on design flow.
 *
 *
 */
export default function Home() {
  return (
    <div>
      <SearchBar
        button={<CommonButton label={"Filter"} leftIcon={<FilterIcon />} />}
        button2={
          <CommonButton
            label="Create Book"
            leftIcon={<AddIcon />}
            onClick={() => {}}
            altTextStyle="text-white"
            altStyle="bg-dark-blue"
          />
        }
        placeholderText="Search for books"
      />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Link
            className="flex items-center justify-center rounded h-16 w-36 bg-gray-500"
            href="dashboard/backendTest"
          >
            <p className="text-center">Click to go to test backend page</p>
          </Link>
          <Link
            className="flex items-center justify-center rounded h-16 w-36 bg-gray-500"
            href="login"
          >
            <p className="text-center">Click to go to login page</p>
          </Link>
          {/* go to signup page */}
          <Link
            className="flex items-center justify-center rounded h-16 w-36 bg-gray-500"
            href="signup"
          >
            <p className="text-center">Click to go to signup page</p>
          </Link>
          <Link
            className="flex items-center justify-center rounded h-16 w-36 bg-gray-500"
            href="manage"
          >
            <p className="text-center">Click to go to user management page</p>
          </Link>
          {/* <AddNewBookForm /> */}
        </div>
      </div>
    </div>
  );
}
