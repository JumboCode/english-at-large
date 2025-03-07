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
import { RequestWithBookAndUser } from "@/lib/util/types";
import { getAllBooks } from "@/lib/api/books";

export interface BookStats {
  totalRequests: number;
  uniqueUsers: number;
}

export default function DataPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [filter, setFilter] = useState<string>("");
  const filterText = filter ? filter : "all time";
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RequestWithBookAndUser[]>([]);
  const [bookStats, setBookStats] = useState<Record<number, BookStats>>({});
  const [books, setBooks] = useState<Book[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // promise.allSettled so they can fail independently.
        const [booksResult, requestsResult, usersResult, requestCountResult] =
          await Promise.allSettled([
            getAllBooks(), // probably pass in the data range into these functions
            getRequests(),
            getAllUsers(),
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

        const allUsers =
          usersResult.status === "fulfilled" && usersResult.value !== undefined
            ? usersResult.value
            : [];
        // Handle the results of the requests request
        const allRequests =
          requestsResult.status === "fulfilled" &&
          requestsResult.value !== undefined
            ? requestsResult.value
            : [];

        // Filter users who have requests
        const usersWithRequests = allUsers.filter((user) =>
          allRequests.some((request) => request.userId === user.id)
        );

        // Update state
        setUsers(usersWithRequests);
        setRequests(allRequests);
      } catch (err) {
        console.error("Unexpected error in fetchData:", err);
      }
    };

    fetchData();
  }, []);

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
        <UserHistory users={users} requests={requests} />
      )}
    </div>
  );
}
