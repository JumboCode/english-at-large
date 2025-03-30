"use client";
import React, { useEffect, useState } from "react";
import CommonDropdown from "@/components/common/forms/Dropdown";
import CalendarMonthIcon from "@/assets/icons/calendar_month";
import BookCatalog from "@/components/common/tables/BookCatalog";
import UserHistory from "@/components/common/tables/UserHistory";
import TableOverview from "@/components/common/tables/TableOverview";
import { Book, User } from "@prisma/client";
import { getAllUsers } from "@/lib/api/users";
import { getRequestCount, getRequests } from "@/lib/api/requests";
import { BookStats, RequestWithBookAndUser } from "@/lib/util/types";
import { getAllBooks } from "@/lib/api/books";

export default function DataPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [filter, setFilter] = useState<string>("");
  const filterText = filter ? filter : "all time";
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RequestWithBookAndUser[]>([]);
  const [bookStats, setBookStats] = useState<Record<number, BookStats>>({});
  const [books, setBooks] = useState<Book[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // new
  const [totalPages, setTotalPages] = useState(0); // new

  useEffect(() => {
    const fetchData = async () => {
      try {
        // promise.allSettled so they can fail independently.
        const [booksResult, requestsResult, usersResult, requestCountResult] =
          await Promise.allSettled([
            getAllBooks(), // probably pass in the data range into these functions
            getRequests(),
            getAllUsers(currentPage, 50),
            getRequestCount(),
          ]);

        // get all book information for book catalog
        if (booksResult.status === "fulfilled" && booksResult.value) {
          setBooks(booksResult.value);
        } else if (booksResult.status === "rejected") {
          console.error("Failed to fetch books:", booksResult.reason);
        }

        // calculate requets stats information for book catalog
        if (requestsResult.status === "fulfilled" && requestsResult.value) {
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

        // const allUsers =
        //   usersResult.status === "fulfilled" && usersResult.value !== undefined
        //     ? usersResult.value
        //     : [];
        // // Handle the results of the requests request
        // const allRequests =
        //   requestsResult.status === "fulfilled" &&
        //   requestsResult.value !== undefined
        //     ? requestsResult.value
        //     : [];

        // // Filter users who have requests
        // const usersWithRequests = allUsers.filter((user) =>
        //   allRequests.some((request) => request.userId === user.id)
        // );

        // // Update state
        // setUsers(usersWithRequests);
        // setRequests(allRequests);
        // Handle users result for pagination
        if (usersResult.status === "fulfilled" && usersResult.value) {
          const { users: fetchedUsers, totalPages: fetchedTotalPages } =
            usersResult.value;
          // Extract all requests from fetched users
          const allRequests = fetchedUsers.flatMap(
            (user) => user.requests || []
          );

          // Filter users who have requests
          const usersWithRequests = fetchedUsers.filter((user) =>
            allRequests.some((request) => request.userId === user.id)
          );

          // Update state
          setUsers(usersWithRequests); // Only users with requests
          setRequests(allRequests); // All requests
          setTotalPages(fetchedTotalPages); // Update total pages

          // console.log("Filtered Users with Requests:", usersWithRequests);
          // console.log("All Requests:", allRequests);
        } else if (usersResult.status === "rejected") {
          console.error("Failed to fetch users:", usersResult.reason);
        }
      } catch (err) {
        console.error("Unexpected error in fetchData:", err);
      }
    };

    fetchData();
  }, [currentPage]);

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
            <CommonDropdown
              items={["all time", "last 4 weeks", "last year"]}
              buttonText={"All time"}
              altButtonStyle="min-w-28"
              leftIcon={<CalendarMonthIcon />}
              setFilter={setFilter}
            />
          </div>
        </div>

        {/* Tab Content */}
      </div>
      {activeTab === "Overview" && (
        <TableOverview filterInfo={filterText} requestCount={requestCount} />
      )}
      {activeTab === "Book Catalog" && (
        <BookCatalog books={books} bookStats={bookStats} />
      )}
      {activeTab === "User History" && (
          <>
          <UserHistory users={users} requests={requests} />
          <div className="pagination-controls flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
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
