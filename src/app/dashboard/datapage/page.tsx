"use client";
import React, { useEffect, useState } from "react";
import CalendarMonthIcon from "@/assets/icons/calendar_month";
import DatePicker from "@/components/common/DatePicker";
import BookCatalog from "@/components/common/tables/BookCatalog";
import UserHistory from "@/components/common/tables/UserHistory";
import TableOverview from "@/components/common/tables/TableOverview";
import { Book, BookRequest, User } from "@prisma/client";
import { getAllUsers } from "@/lib/api/users";
import { getRequestCount } from "@/lib/api/requests";
import { BookStats, BookWithRequests } from "@/lib/util/types";
import { getAllBooks } from "@/lib/api/books";
import { DateRange } from "react-day-picker";

export default function DataPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const filterText =
    range?.from && range?.to
      ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
      : "all time";
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [bookStats, setBookStats] = useState<Record<number, BookStats>>({});
  const [books, setBooks] = useState<Book[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  const [currentBookPage, setCurrentBookPage] = useState(1); // For Book Catalog
  const [totalBookPages, setTotalBookPages] = useState(0); // Total pages for books

  const [currentUserPage, setCurrentUserPage] = useState(1); // For User History
  const [totalUserPages, setTotalUserPages] = useState(0); // Total pages for users

  useEffect(() => {
    if (activeTab === "Book Catalog") {
      const fetchBooks = async () => {
        try {
          const booksResult = await getAllBooks({
            page: currentBookPage,
            withStats: true,
            fromDate: range?.from,
            endDate: range?.to,
          });
          if (booksResult) {
            const { books: fetchedBooks, totalPages: fetchedTotalPages } =
              booksResult as {
                books: (BookWithRequests & BookStats)[];
                totalPages: number;
              };

            const bookStats: Record<number, BookStats> = {};
            for (const book of fetchedBooks) {
              bookStats[book.id] = {
                totalRequests: book.requests ? book.requests.length : 0,
                uniqueUsers: book.uniqueUsers || 0,
              };
            }
            setBooks(fetchedBooks);
            setTotalBookPages(fetchedTotalPages);
            setBookStats(bookStats);
          }
        } catch (err) {
          console.error("Failed to fetch books:", err);
        }
      };

      fetchBooks();
    }
  }, [currentBookPage, activeTab, range]); // Refetch books when currentBookPage or activeTab changes

  useEffect(() => {
    if (activeTab === "User History") {
      const fetchUsers = async () => {
        try {
          const usersResult = await getAllUsers(currentUserPage, 10);
          if (usersResult) {
            const { users: fetchedUsers, totalPages: fetchedTotalPages } =
              usersResult;
            const allRequests = fetchedUsers.flatMap(
              (user) => user.requests || []
            );
            const usersWithRequests = fetchedUsers.filter((user) =>
              allRequests.some((request) => request.userId === user.id)
            );

            setUsers(usersWithRequests);
            setRequests(allRequests);
            setTotalUserPages(fetchedTotalPages);
          }
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      };

      fetchUsers();
    }
  }, [currentUserPage, activeTab]); // Refetch users when currentUserPage or activeTab changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        // promise.allSettled so they can fail independently.
        const [requestCountResult] = await Promise.allSettled([
          getRequestCount(range?.from, range?.to),
        ]);

        // calculate the number of requests
        if (
          requestCountResult.status === "fulfilled" &&
          requestCountResult.value !== undefined
        ) {
          setRequestCount(requestCountResult.value);
        } else if (requestCountResult.status === "rejected") {
          console.error(
            "Failed to fetch request count:",
            requestCountResult.reason
          );
        }
      } catch (err) {
        console.error("Unexpected error in fetchData:", err);
      }
    };
    fetchData();
  }, [range]);

  return (
    <div>
      <div className="bg-white px-16 pt-12">
        <h1 className="text-black font-bold text-3xl font-[family-name:var(--font-rubik)] mb-4">
          Dashboard
        </h1>
        <div className="flex justify-between">
          <div className="w-fit">
            <div className="flex">
              {["Overview", "Book Catalog", "User History"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-8 text-md ${
                    activeTab === tab
                      ? "border-b-2 border-[#202D74] text-[#202D74]"
                      : "border-b-2 text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex">
            <DatePicker
              range={range}
              setRange={setRange}
              altButtonStyle="min-w-28"
              leftIcon={<CalendarMonthIcon />}
            />
          </div>
        </div>

        {/* Tab Content */}
      </div>
      {activeTab === "Overview" && (
        <TableOverview filterInfo={filterText} requestCount={requestCount} />
      )}
      {activeTab === "Book Catalog" && (
        <>
          <BookCatalog books={books} bookStats={bookStats} />
          <div className="pagination-controls flex justify-center mt-4">
            <button
              onClick={() =>
                setCurrentBookPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentBookPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {totalBookPages > 0 ? currentBookPage : 0} of{" "}
              {totalBookPages}
            </span>
            <button
              onClick={() =>
                setCurrentBookPage((prev) => Math.min(prev + 1, totalBookPages))
              }
              disabled={currentBookPage === totalBookPages}
              className="px-4 py-2 bg-gray-200 rounded-md ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
      {activeTab === "User History" && (
        <>
          <UserHistory users={users} requests={requests} />
          <div className="pagination-controls flex justify-center mt-4">
            <button
              onClick={() =>
                setCurrentUserPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentUserPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentUserPage} of {totalUserPages}
            </span>
            <button
              onClick={() =>
                setCurrentUserPage((prev) => Math.min(prev + 1, totalUserPages))
              }
              disabled={currentUserPage === totalUserPages}
              className="px-4 py-2 bg-gray-200 rounded-md ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
