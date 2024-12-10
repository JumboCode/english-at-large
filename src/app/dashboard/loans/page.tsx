"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import { Book, BookRequest, BookStatus, User } from "@prisma/client";
import CommonDropdown from "@/components/common/forms/Dropdown";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import { getRequests, updateRequest } from "@/lib/api/requests";
import LoanDropdown from "@/components/common/forms/LoanDropdown";
import { updateBook } from "@/lib/api/books";
import { emptyRequest } from "@/lib/util/types";

const Loans = () => {
  const [requests, setRequests] = useState<
    (BookRequest & { user: User; book: Book })[]
  >([]);
  const [oneRequest, setOneRequest] = useState<BookRequest>(emptyRequest);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const updateReq = async (req: BookRequest) => {
    await updateRequest(req);
    if (req) {
      setOneRequest(req);
    }
  };

  const requestFilter = (request: BookRequest) => {
    switch (selectedValue) {
      case "Pick-up":
        return request.status === BookStatus.Pickup;
      case "Borrowed":
        return request.status === BookStatus.Borrowed;
      default:
        return request.status !== BookStatus.Returned;
    }
  };

  const sortByDate = (a: BookRequest, b: BookRequest) => {
    switch (selectedValue) {
      case "Request Date":
        return a.requestedOn > b.requestedOn ? 1 : -1;
      case "Return Date":
        return a.returnedBy > b.returnedBy ? 1 : -1;
      default:
        return a.requestedOn > b.requestedOn ? 1 : -1;
    }
  };

  useEffect(() => {
    const getReqs = async () => {
      const allRequests = await getRequests();
      setRequests(allRequests ?? []);
    };

    getReqs();
  }, [oneRequest, selectedValue]);

  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        Manage loans
      </h1>
      <SearchBar
        button={
          <CommonDropdown
            items={["Request Date", "Return Date", "Pick-up", "Borrowed"]}
            altButtonStyle="min-w-40"
            buttonText={"Sort by"}
            setFilter={setSelectedValue}
          />
        }
        placeholderText="Search by name or email"
        setSearchData={null}
      />
      <div className="px-16">
        <table className="table-auto bg-white w-full font-family-name:var(--font-geist-sans)]">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/6 px-2 py-1 text-left text-text-default-secondary">
                Name
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Book Title
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Requested On
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Return By
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                Status
              </th>
              <th className="w-1/6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {requests
              .filter(requestFilter)
              .sort(sortByDate)
              .map((request, index) => (
                <tr key={index} className="bg-white h-16">
                  <td className="flex flex-col">
                    <p className="text-black font-semibold">
                      {request.user?.name}
                    </p>
                    <Link
                      href={"mailto:" + request.user?.email}
                      className="text-text-default-secondary underline max-w-max"
                    >
                      {request.user?.email}
                    </Link>
                  </td>
                  <td className="underline" style={{ color: "#202d74" }}>
                    <Link
                      href={`books/${request.bookId}`}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex justify-between min-w-max max-w-[50%]">
                        {request.book?.title}
                      </div>
                    </Link>
                  </td>

                  <td className="text-black">
                    {dateToTimeString(request.requestedOn)}
                  </td>

                  <td className="text-black">
                    {dateToTimeString(request.returnedBy)}
                  </td>

                  <td className="text-black">
                    <LoanDropdown
                      report={request}
                      selectedValue={selectedValue}
                      // oneRequest={oneRequest}
                      updateReq={updateReq}
                    ></LoanDropdown>
                  </td>

                  <td>
                    <div className="flex justify-start items-center">
                      <CommonButton
                        label="Mark as Returned"
                        onClick={async () => {
                          await updateBook({
                            ...request.book,
                            status: BookStatus.Available,
                          });
                          await updateReq({
                            ...request,
                            status: BookStatus.Returned,
                          });
                        }}
                        altTextStyle="text-white"
                        altStyle="bg-dark-blue"
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loans;
