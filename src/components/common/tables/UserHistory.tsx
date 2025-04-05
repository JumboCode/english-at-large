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
      <div className="px-16">
        <table className="table-auto bg-white w-full">
          <thead>
            <tr className="bg-gray-100 h-[50px]">
              <th className="text-left text-text-default-secondary px-3 w-[20%]">
                Name
              </th>
              <th className="text-left text-text-default-secondary w-[30%] pl-6">
                Book title
              </th>
              <th className="text-left text-text-default-secondary w-[15%] pl-8">
                Requested on
              </th>
              <th className="text-left text-text-default-secondary w-[10%] pl-2">
                Return by
              </th>
              <th className="text-left text-text-default-secondary w-[15%] pl-6">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {subsetUsers.map((user, index) => {
              const userRequests = requestsByUser[user.id];

              return (
                <tr key={index} className="bg-white h-16">
                  <td className="pl-3 w-[20%] align-top py-3">
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
                  <td colSpan={4} className="w-[80%] py-3">
                    <div className="grid grid-cols-[40%_15%_20%_15%] gap-5">
                      {userRequests.map((request, reqIndex) => (
                        <React.Fragment key={reqIndex}>
                          <Link
                            href={`books/${request.bookId}`}
                            className="underline text-[#202D74] pl-6"
                          >
                            {request.bookTitle}
                          </Link>

                          <div className="pl-10">
                            {dateToTimeString(request.requestedOn)}
                          </div>

                          <div className="pl-16">
                            {request.returnedBy
                              ? dateToTimeString(request.returnedBy)
                              : "Not Returned Yet"}
                          </div>

                          <div>
                            <LoanDropdown
                              report={request}
                              selectedValue={selectedValue}
                            />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  return <></>;
};

export default UserHistory;
