"use client";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CommonDropdown from "../forms/Dropdown";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, BookRequest } from "@prisma/client";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import LoanDropdown from "../forms/LoanDropdown";
import { emptyRequest } from "@/lib/util/types";

interface UserHistoryProps {
  users: User[];
  requests: BookRequest[];
}

const UserHistory = (props: UserHistoryProps) => {
  const user = useCurrentUser();

  const { users, requests } = props;
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    if (user?.role !== "Admin" && user?.role != undefined) {
      redirect("/dashboard");
    }
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [oneRequest, setOneRequest] = useState<BookRequest>(emptyRequest);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedValue, setSelectedValue] = useState<string>("");

  // use of structured clone creates new subset of search target users
  // allows filter to act on subset of searched users
  const requestsByUser = useMemo(() => {
    const grouped: Record<string, BookRequest[]> = {};

    requests.forEach((request) => {
      const userId = request.userId;
      if (!grouped[userId]) {
        grouped[userId] = [];
      }
      grouped[userId].push(request);
    });

    return grouped;
  }, [requests]); // Recompute only when `requests` changes

  const subsetUsers = structuredClone<User[]>(users)
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchData) ||
        user.email?.toLowerCase().includes(searchData)
    )
    .filter(
      (user) => requestsByUser[user.id] && requestsByUser[user.id].length > 0
    ); // Filter users with requests

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
        placeholderText="Search by user name"
        setSearchData={setSearchData}
      />
      {/* CHANGE 2: Update the px-16 to be responsive and add overflow handling */}
      <div className="px-4 md:px-8 lg:px-16 overflow-x-auto">
        {/* CHANGE 3: Make the table more stable with min-w-full */}
        <table className="min-w-full table-auto bg-white">
          <thead>
            <tr className="bg-gray-100 h-[50px]">
              {/* CHANGE 4: Remove percentage widths and use fixed widths or flexible ones */}
              <th className="text-left text-text-default-secondary px-4 w-64">
                Name
              </th>
              <th className="text-left text-text-default-secondary px-4">
                Book title
              </th>
              <th className="text-left text-text-default-secondary px-4 w-40">
                Requested on
              </th>
              <th className="text-left text-text-default-secondary px-4 w-40">
                Return on
              </th>
              <th className="text-left text-text-default-secondary px-4 w-40">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {subsetUsers.map((user, index) => {
              const userRequests = requestsByUser[user.id];

              // CHANGE 5: Restructure how requests are displayed
              // Instead of using a grid inside a cell, create a row for each request
              return userRequests.map((request, reqIndex) => (
                <tr key={`${index}-${reqIndex}`} className="bg-white h-16">
                  {/* Show user info only in the first row for this user */}
                  {reqIndex === 0 ? (
                    <td
                      className="px-4 align-top py-4"
                      rowSpan={userRequests.length}
                    >
                      <div className="flex flex-col">
                        <span style={{ color: "black" }}>{user.name}</span>
                        <Link
                          href={"mailto:" + user.email}
                          className="text-text-default-secondary underline"
                        >
                          {user.email}
                        </Link>
                      </div>
                    </td>
                  ) : null}

                  {/* Book title */}
                  <td className="px-4 py-4">
                    <Link
                      href={`books/${request.bookId}`}
                      className="underline text-[#202D74]"
                    >
                      {request.bookTitle}
                    </Link>
                  </td>

                  {/* Requested date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {dateToTimeString(request.requestedOn)}
                  </td>

                  {/* Return date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {request.returnedBy
                      ? dateToTimeString(request.returnedBy)
                      : "Not Returned Yet"}
                  </td>

                  {/* Status dropdown */}
                  <td className="px-4 py-4">
                    <LoanDropdown
                      report={request}
                      selectedValue={selectedValue}
                    />
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  return <></>;
};

export default UserHistory;
