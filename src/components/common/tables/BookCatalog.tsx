"use client";
import React, { useState } from "react";
import { Book } from "@prisma/client";
import SearchBar from "@/components/SearchBar";
import CommonDropdown from "../forms/Dropdown";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import { BookStats } from "@/app/dashboard/datapage/page";

interface BookCatalogProps {
  bookStats: Record<number, BookStats>;
  books: Book[];
}
const BookCatalog = (props: BookCatalogProps) => {
  const { bookStats, books } = props;

  const [searchData, setSearchData] = useState("");

  const subsetBooks = structuredClone<Book[]>(books).filter((book) =>
    book.title.toLowerCase().includes(searchData)
  );

  return (
    <div className="bg-white">
      <SearchBar
        button={
          <CommonDropdown
            items={["hello", "world"]}
            altButtonStyle="min-w-40"
            buttonText={"Sort by"}
            setFilter={() => {}}
          />
        }
        placeholderText="Search by book title"
        setSearchData={setSearchData}
      />
      <div className="px-16">
        <table className="table-auto bg-white w-full font-family-name:var(--font-geist-sans)]">
          <thead>
            <tr className="bg-gray-100 h-[50px]">
              <th className="w-3/6  text-left text-text-default-secondary px-3">
                Book title
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                No. of times borrowed
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Unique borrowers
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                Date added
              </th>
              <th className="w-1/6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {subsetBooks
              //   .filter(requestFilter)
              //   .sort(sortByDate)
              .map((book, index) => (
                <tr key={index} className="bg-white h-16">
                  <td className="underline px-3" style={{ color: "#202D74" }}>
                    <Link href={`books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>
                    <p>{bookStats[book.id]?.totalRequests || 0}</p>
                  </td>

                  <td>
                    <p>{bookStats[book.id]?.uniqueUsers || 0}</p>
                  </td>

                  <td>{dateToTimeString(book.createdAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookCatalog;
