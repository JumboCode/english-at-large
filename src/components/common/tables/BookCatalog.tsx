"use client";
import React from "react";
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
  searchData: string;
  setSearchData: (search: string) => void;
}

const BookCatalog = ({
  books,
  bookStats,
  range,
  setRange,
  searchData,
  setSearchData,
}: BookCatalogProps) => {
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
        defaultValue={searchData}
      />
      <div className="px-16">
        <table className="table-auto bg-white w-full font-family-name:var(--font-geist-sans)]">
          <thead>
            <tr className="bg-gray-100 h-[50px]">
              <th className="w-3/6 text-left text-text-default-secondary px-3">
                Book title
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                No. of times borrowed
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                Unique borrowers
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                Date added
              </th>
              <th className="w-1/6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {books.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book, index) => (
                <tr key={index} className="bg-white h-16">
                  <td className="underline px-3" style={{ color: "#202D74" }}>
                    <Link href={`books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{bookStats[book.id]?.totalRequests || 0}</td>
                  <td>{bookStats[book.id]?.uniqueUsers || 0}</td>
                  <td>{dateToTimeString(book.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookCatalog;
