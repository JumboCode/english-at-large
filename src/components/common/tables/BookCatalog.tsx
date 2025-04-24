"use client";
import React, { useState } from "react";
import { Book } from "@prisma/client";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import { BookStats } from "@/lib/util/types";
import DatePicker from "../DatePicker";
import { DateRange } from "react-day-picker";
import CalendarMonthIcon from "@/assets/icons/calendar_month";

interface BookCatalogProps {
  bookStats: Record<number, BookStats>;
  books: Book[];
  range?: DateRange;
  setRange: (range?: DateRange) => void;
}
const BookCatalog = (props: BookCatalogProps) => {
  const { bookStats, books, range, setRange } = props;

  const [searchData, setSearchData] = useState("");

  const subsetBooks = structuredClone<Book[]>(books).filter((book) =>
    book.title.toLowerCase().includes(searchData)
  );

  return (
    <div className="bg-white">
      <SearchBar
        button={
          <DatePicker
            range={range}
            setRange={setRange}
            altButtonStyle="min-w-28"
            leftIcon={<CalendarMonthIcon />}
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
