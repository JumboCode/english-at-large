"use client";
import React from "react";
import { Book } from "@prisma/client";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import { BookStats } from "@/lib/util/types";
import { DateRange } from "react-day-picker";

interface BookCatalogProps {
  bookStats: Record<number, BookStats>;
  books: Book[];
  range?: DateRange;
  setRange: (range?: DateRange) => void;
  searchData: string;
}
const BookCatalog = (props: BookCatalogProps) => {
  const { bookStats, books, searchData } = props;

  const subsetBooks = structuredClone<Book[]>(books).filter((book) =>
    book.title.toLowerCase().includes(searchData)
  );

  return (
    <div className="bg-white">
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
        {subsetBooks.length === 0 ? (
          <p className="ml-2 mt-4">
            There are no requests on books found in this date range.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default BookCatalog;
