"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import { Book, BookRequest, RequestStatus, User } from "@prisma/client";
import CommonDropdown from "@/components/common/forms/Dropdown";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import { deleteRequest, getRequests, updateRequest } from "@/lib/api/requests";
import LoanDropdown from "@/components/common/forms/LoanDropdown";
import { updateBook } from "@/lib/api/books";
import { emptyRequest, RequestWithBookAndUser } from "@/lib/util/types";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
} from "@/lib/context/ConfirmPopupContext";
import useVolunteerLevelRedirect from "@/lib/hooks/useVolunteerLevelRedirect";
import LoanStatusTag from "@/components/common/LoanStatusTag";

const Loans = () => {
  useVolunteerLevelRedirect();
  const [requests, setRequests] = useState<RequestWithBookAndUser[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchData, setSearchData] = useState("");
  const [oneRequest, setOneRequest] = useState<BookRequest>(emptyRequest); //
  const { setConfirmPopup, hidePopup, popupStatus } = usePopup();
  const currDate = new Date();
  // use of structured clone creates new subset of search target requests
  // allows filter to act on subset of searched requests

  const subsetRequest = useMemo(() => {
    return requests.filter(
      (request) =>
        request.bookTitle.toLowerCase().includes(searchData.toLowerCase()) ||
        request.user?.name?.toLowerCase().includes(searchData.toLowerCase()) ||
        request.user?.email?.toLowerCase().includes(searchData.toLowerCase())
    );
  }, [requests, searchData]);

  const requestFilter = useCallback(
    (request: BookRequest) => {
      switch (selectedValue) {
        case "Pick-up":
          return request.status === RequestStatus.Pickup;
        case "Borrowed":
          return request.status === RequestStatus.Borrowed;
        default:
          return (
            request.status !== RequestStatus.Returned &&
            request.status !== RequestStatus.Hold
          );
      }
    },
    [selectedValue]
  );

  const sortByDate = (a: BookRequest, b: BookRequest) => {
    switch (selectedValue) {
      case "Request Date":
        return a.requestedOn > b.requestedOn ? 1 : -1;
      case "Due Date": {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date();
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date();
        return dateB.getTime() - dateA.getTime(); // most recent first
      }
      default: {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date();
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date();
        return dateA.getTime() - dateB.getTime(); // most recent first
      }
    }
  };

  const markAsReturned = async (request: RequestWithBookAndUser) => {
    try {
      await updateBook({
        ...request.book,
      });
      await updateRequest({
        ...request,
        status: RequestStatus.Returned,
        returnedBy: new Date(),
      });
      setConfirmPopup({
        type: ConfirmPopupTypes.RETURNED,
        action: ConfirmPopupActions.MARK,
        success: true,
      });

      // // finds oldest request of status hold and sends email
      // const holds = requests.filter(
      //   (holdRequest) =>
      //     holdRequest.status === RequestStatus.Hold &&
      //     holdRequest.bookId === request.bookId
      // );

      // // if there are any holds for the current book
      // if (holds.length > 0) {
      //   const earliestHold = holds[0];
      //   await updateRequest({ ...earliestHold, status: RequestStatus.Pickup });
      // }

      // if (request) {
      //   setOneRequest(request);
      // }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setConfirmPopup({
        type: ConfirmPopupTypes.RETURNED,
        action: ConfirmPopupActions.MARK,
        success: false,
      });
    }
  };

  const deleteReq = async (req: BookRequest) => {
    await deleteRequest(req.id);
    if (req) {
      setOneRequest(req);
    }
  };

  const cancelReq = async (
    request: BookRequest & { user: User; book: Book }
  ) => {
    try {
      await deleteReq(request);

      setConfirmPopup({
        type: ConfirmPopupTypes.REQUEST,
        action: ConfirmPopupActions.CANCEL,
        success: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setConfirmPopup({
        type: ConfirmPopupTypes.REQUEST,
        action: ConfirmPopupActions.CANCEL,
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
  }, [oneRequest]);

  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        Manage loans
      </h1>
      <SearchBar
        button={
          <CommonDropdown
            items={["Request Date", "Due Date", "Pick-up", "Borrowed"]}
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
                Due Date
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
                  <td>
                    <div className="flex flex-col">
                      <p className="text-black font-semibold">
                        {request.user?.name}
                      </p>
                      <Link
                        href={"mailto:" + request.user?.email}
                        className="text-text-default-secondary underline truncate block max-w-[99%] pr-2"
                      >
                        {request.user?.email}
                      </Link>
                    </div>
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

                  <td
                    className={
                      request.dueDate && new Date(request.dueDate) <= currDate
                        ? "text-[#C00F0C]"
                        : "text-black"
                    }
                  >
                    {request.dueDate
                      ? dateToTimeString(request.dueDate)
                      : "Not Found"}
                  </td>

                  <td className="text-black">
                    {request.status !== RequestStatus.Borrowed ? (
                      <LoanDropdown
                        report={request}
                        selectedValue={selectedValue}
                      />
                    ) : (
                      <LoanStatusTag status={request.status} />
                    )}
                  </td>

                  <td>
                    {request.status === RequestStatus.Borrowed ? (
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
                    ) : (
                      <div className="flex justify-center items-center">
                        <CommonButton
                          label="Cancel Request"
                          onClick={async () => {
                            await cancelReq(request);
                          }}
                          altTextStyle="text-white"
                          altStyle="bg-[#C00F0C] border-0"
                        />
                      </div>
                    )}
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
