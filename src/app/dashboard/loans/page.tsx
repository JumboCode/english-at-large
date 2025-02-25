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
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
} from "@/lib/context/ConfirmPopupContext";

const Loans = () => {
  const [requests, setRequests] = useState<
    (BookRequest & { user: User; book: Book })[]
  >([]);
  const [oneRequest, setOneRequest] = useState<BookRequest>(emptyRequest);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchData, setSearchData] = useState("");

  const { setConfirmPopup, hidePopup, popupStatus } = usePopup();

  // use of structured clone creates new subset of search target requests
  // allows filter to act on subset of searched requests

  const subsetRequest = structuredClone<
    (BookRequest & { user: User; book: Book })[]
  >(requests).filter(
    (request) =>
      request.bookTitle.toLowerCase().includes(searchData) ||
      request.user?.name?.toLowerCase().includes(searchData) ||
      request.user?.email?.toLowerCase().includes(searchData)
  );

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

  const markAsReturned = async (
    request: BookRequest & { user: User; book: Book }
  ) => {
    try {
      await updateBook({
        ...request.book,
        status: BookStatus.Available,
      });
      await updateReq({
        ...request,
        status: BookStatus.Returned,
      });
      setConfirmPopup({
        type: ConfirmPopupTypes.RETURNED,
        action: ConfirmPopupActions.MARK,
        success: true,
      });

      // send users who are on hold an email when book is available
      // TODO: implement waitlist functionality (CHANGE INPUTTED REQUEST HERE)
      await sendWaitlistNotificationEmail(request.id); 


    } catch (error) {
      setConfirmPopup({
        type: ConfirmPopupTypes.RETURNED,
        action: ConfirmPopupActions.MARK,
        success: false,
      });
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
        setSearchData={setSearchData}
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
            {subsetRequest
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
                      <div className="flex justify-between max-w-[99%] ">
                        <p className="line-clamp-2">{request.book?.title}</p>
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
                    <div className="flex justify-center items-center">
                      <CommonButton
                        label="Mark as Returned"
                        onClick={async () => {
                          await markAsReturned(request);
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
      {popupStatus.shown ? (
        <ConfirmationPopup
          type={popupStatus.type}
          action={popupStatus.action}
          success={popupStatus.success}
          onDisappear={() => hidePopup()}
          custom={popupStatus.custom}
        />
      ) : null}
    </div>
  );
};

export default Loans;
