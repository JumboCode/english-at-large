"use client";
import React, { useEffect, useState } from "react";
import { getAllBooks } from "@/lib/api/books";
import { getRequests } from "@/lib/api/requests";
import { Book } from "@prisma/client";
import SearchBar from "@/components/SearchBar";
import CommonDropdown from "../forms/Dropdown";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";

const BookCatalog = () => {
  interface BookStats {
    totalRequests: number;
    uniqueUsers: number;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [searchData, setSearchData] = useState("");
  const [bookStats, setBookStats] = useState<Record<number, BookStats>>({});

  const subsetBooks = structuredClone<Book[]>(books).filter((book) =>
    book.title.toLowerCase().includes(searchData)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResult, requestsResult] = await Promise.allSettled([
          getAllBooks(),
          getRequests(),
        ]);

        if (booksResult.status === "fulfilled" && booksResult.value) {
          setBooks(booksResult.value);
        } else if (booksResult.status === "rejected") {
          console.error("Failed to fetch books:", booksResult.reason);
        }

        if (requestsResult.status === "fulfilled" && requestsResult.value) {
          // Process requests to calculate stats for each book
          // create temp record and stick users into a set
          const stats: Record<
            number,
            { totalRequests: number; uniqueUsers: Set<string> }
          > = {};

          requestsResult.value.forEach(({ user, book }) => {
            if (!stats[book.id]) {
              stats[book.id] = { totalRequests: 0, uniqueUsers: new Set() };
            }
            stats[book.id].totalRequests += 1;
            stats[book.id].uniqueUsers.add(user.id);
          });

          // Convert sets to counts
          const processedStats: Record<number, BookStats> = {};
          for (const [bookId, { totalRequests, uniqueUsers }] of Object.entries(
            stats
          )) {
            processedStats[Number(bookId)] = {
              totalRequests,
              uniqueUsers: uniqueUsers.size,
            };
          }

          setBookStats(processedStats);
        } else if (requestsResult.status === "rejected") {
          console.error("Failed to fetch requests:", requestsResult.reason);
        }
      } catch (err) {
        console.error("Unexpected error in fetchData:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        Dashboard
      </h1>
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
