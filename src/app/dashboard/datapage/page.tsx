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
import LoadingSkeleton from "@/app/loading";
import SearchBar from "@/components/SearchBar";

export default function DataPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [bookStats, setBookStats] = useState<Record<number, BookStats>>({});
  const [books, setBooks] = useState<Book[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  const [topThree, setTopThree] = useState<Book[]>([]);
  const [averageDuration, setAverageDuration] = useState<string>("");

  const [currentBookPage, setCurrentBookPage] = useState(1); // For Book Catalog
  const [totalBookPages, setTotalBookPages] = useState(0); // Total pages for books

  const [currentUserPage, setCurrentUserPage] = useState(1); // For User History
  const [totalUserPages, setTotalUserPages] = useState(0); // Total pages for users

  // user history and book catalog can share the same search data, reset each time
  const [searchData, setSearchData] = useState<string>("");

  // LOADING STATES
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingGraphs, setLoadingGraphs] = useState(false);

  useEffect(() => {
    if (activeTab === "Book Catalog") {
      const fetchBooks = async () => {
        setLoadingBooks(true);
        try {
          const booksResult = await getAllBooks({
            page: currentBookPage,
            limit: 10,
            withStats: true,
            fromDate: range?.from,
            endDate: range?.to,
            search: searchData,
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
        } finally {
          setLoadingBooks(false);
        }
      };

      fetchBooks();
    }
  }, [currentBookPage, activeTab, range, searchData]); // Refetch books when currentBookPage or activeTab changes

  useEffect(() => {
    if (activeTab === "User History") {
      setLoadingUsers(true);
      const fetchUsers = async () => {
        try {
          const usersResult = await getAllUsers({
            page: currentUserPage,
            limit: 10,
            fromDate: range?.from,
            endDate: range?.to,
            search: searchData,
          });
          if (usersResult) {
            const { users: fetchedUsers, totalPages: fetchedTotalPages } =
              usersResult;

            setUsers(fetchedUsers); // no manual filtering
            setRequests(fetchedUsers.flatMap((user) => user.requests || [])); // still set requests if needed
            setTotalUserPages(fetchedTotalPages);
            setTotalUserPages(fetchedTotalPages);
          }
        } catch (err) {
          console.error("Failed to fetch users:", err);
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [range, currentUserPage, activeTab, searchData]); // Refetch users when currentUserPage or activeTab changes

  useEffect(() => {
    setLoadingGraphs(true);
    const fetchData = async () => {
      try {
        const booksResult = await getAllBooks({
          withStats: true,
          fromDate: range?.from,
          endDate: range?.to,
        });

        if (booksResult) {
          const { books: fetchedBooks } = booksResult as {
            books: (BookWithRequests & BookStats)[];
            totalPages: number;
          };

          // getting top 3 most requested books
          const top3 = fetchedBooks
            .sort((a, b) => {
              return (
                (b.requests ? b.requests.length : 0) -
                (a.requests ? a.requests.length : 0)
              );
            })
            .slice(0, 3);
          setTopThree(top3);

          // aggregating all the requests
          const allRequests = fetchedBooks.flatMap(
            (book) => book.requests ?? []
          );
          if (allRequests.length > 0) {
            const avgTime =
              allRequests
                .filter((req) => req.returnedBy)
                .reduce((prev, curr) => {
                  if (!curr.returnedBy) return 0;
                  return (
                    new Date(curr.returnedBy).getTime() -
                    new Date(curr.requestedOn).getTime() +
                    prev
                  );
                }, 0) / allRequests.length;

            const avgMinutes = avgTime / 60000;
            const avgHours = avgMinutes / 60;
            const avgDays = avgHours / 24;
            const avgWeeks = avgDays / 7;

            const displayText =
              Math.floor(avgWeeks) > 0
                ? Math.floor(avgWeeks) + " Weeks"
                : Math.floor(avgDays) + " Days";
            setAverageDuration(displayText);
          } else {
            setAverageDuration("No requests");
          }
        }
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
      } finally {
        setCurrentUserPage(1);
        setCurrentBookPage(1);
        setLoadingGraphs(false);
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

          {activeTab === "Overview" ? (
            <div className="flex">
              <DatePicker
                range={range}
                setRange={setRange}
                altButtonStyle="min-w-28"
                leftIcon={<CalendarMonthIcon />}
              />
            </div>
          ) : null}
        </div>

        {/* Tab Content */}
      </div>
      {activeTab === "Overview" &&
        (loadingGraphs ? (
          <LoadingSkeleton />
        ) : (
          <TableOverview
            borrowDuration={averageDuration}
            topThree={topThree}
            requestCount={requestCount}
            range={range}
          />
        ))}
      {activeTab === "Book Catalog" && (
        <>
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
          {loadingBooks ? (
            <LoadingSkeleton />
          ) : (
            <>
              <BookCatalog
                books={books}
                bookStats={bookStats}
                range={range}
                setRange={setRange}
                searchData={searchData}
              />
              {totalBookPages > 1 && (
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
                    Page {currentBookPage} of {totalBookPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentBookPage((prev) =>
                        Math.min(prev + 1, totalBookPages)
                      )
                    }
                    disabled={currentBookPage === totalBookPages}
                    className="px-4 py-2 bg-gray-200 rounded-md ml-2 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      {activeTab === "User History" && (
        <>
          <SearchBar
            button={
              <DatePicker
                range={range}
                setRange={setRange}
                altButtonStyle="min-w-28"
                leftIcon={<CalendarMonthIcon />}
              />
            }
            placeholderText="Search by user name"
            setSearchData={setSearchData}
          />
          {loadingUsers ? (
            <LoadingSkeleton />
          ) : (
            <>
              <UserHistory
                users={users}
                requests={requests}
                range={range}
                setRange={setRange}
                searchData={searchData}
              />
              {totalUserPages > 1 && (
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
                      setCurrentUserPage((prev) =>
                        Math.min(prev + 1, totalUserPages)
                      )
                    }
                    disabled={currentUserPage === totalUserPages}
                    className="px-4 py-2 bg-gray-200 rounded-md ml-2 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
