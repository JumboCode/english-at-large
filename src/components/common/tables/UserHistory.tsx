"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CommonDropdown from "../forms/Dropdown";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Book, BookRequest } from "@prisma/client";
import { getRequests, updateRequest } from "@/lib/api/requests";
import { getAllUsers } from "@/lib/api/users";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import LoanDropdown from "../forms/LoanDropdown";
import { emptyRequest } from "@/lib/util/types";

const UserHistory = () => {
  const user = useCurrentUser();

  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    if (user?.role !== "Admin" && user?.role != undefined) {
      redirect("/dashboard");
    }
  }, [user]);

  const [users, setUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [oneRequest, setOneRequest] = useState<BookRequest>(emptyRequest);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedValue, setSelectedValue] = useState<string>("");

  const [requests, setRequests] = useState<
    (BookRequest & { user: User; book: Book })[]
  >([]);

  // use of structured clone creates new subset of search target users
  // allows filter to act on subset of searched users
  const subsetUsers = structuredClone<User[]>(users).filter(
    (user) =>
      user.name?.toLowerCase().includes(searchData) ||
      user.email?.toLowerCase().includes(searchData)
  );

  useEffect(() => {
    const getReqs = async () => {
      const allRequests = await getRequests();
      setRequests(allRequests ?? []);
    };

    getReqs();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers ?? []);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getAllUsers();
      const allRequests = (await getRequests()) ?? [];
      const usersWithRequests =
        allUsers?.filter((user) =>
          allRequests.some((request) => request.userId === user.id)
        ) ?? [];

      setUsers(usersWithRequests);
    };

    fetchData();
  }, []);

  const requestsByUser = (
    requests: (BookRequest & { user: User; book: Book })[],
    id: string
  ) => {
    return requests.filter((request) => request.user.id === id);
  };

  const updateReq = async (req: BookRequest) => {
    await updateRequest(req);
    if (req) {
      setOneRequest(req);
    }
  };

  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        User History
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
              const userRequests = requestsByUser(requests, user.id);

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
                            href={`books/${request.book.id}`}
                            className="underline text-[#202D74] pl-6"
                          >
                            {request.bookTitle}
                          </Link>

                          <div className="pl-10">
                            {dateToTimeString(request.requestedOn)}
                          </div>

                          <div className="pl-16">
                            {dateToTimeString(request.returnedBy)}
                          </div>

                          <div>
                            <LoanDropdown
                              report={request}
                              selectedValue={selectedValue}
                              updateReq={updateReq}
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
};

export default UserHistory;
