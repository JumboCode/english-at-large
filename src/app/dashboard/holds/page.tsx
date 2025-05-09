"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import { Book, BookRequest, User, RequestStatus } from "@prisma/client";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import { deleteRequest, getRequests } from "@/lib/api/requests";
// import LoanDropdown from "@/components/common/forms/LoanDropdown";
import {
  emptyRequest,
  getAvailableCopies,
  RequestWithBookAndUser,
} from "@/lib/util/types";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
} from "@/lib/context/ConfirmPopupContext";
import useVolunteerLevelRedirect from "@/lib/hooks/useVolunteerLevelRedirect";

const Loans = () => {
  useVolunteerLevelRedirect();
  const [requests, setRequests] = useState<RequestWithBookAndUser[]>([]);
  const [oneRequest, setOneRequest] = useState<BookRequest>(emptyRequest);
  const [searchData, setSearchData] = useState("");

  const { setConfirmPopup, hidePopup, popupStatus } = usePopup();

  // use of structured clone creates new subset of search target requests
  // allows filter to act on subset of searched requests

  const subsetRequest = structuredClone<RequestWithBookAndUser[]>(
    requests
  ).filter(
    (request) =>
      request.status == RequestStatus.Hold &&
      (request.bookTitle.toLowerCase().includes(searchData) ||
        request.user?.name?.toLowerCase().includes(searchData) ||
        request.user?.email?.toLowerCase().includes(searchData))
  );

  // note: see markAsDone function
  // const updateReq = async (req: BookRequest) => {
  //   await updateRequest(req);
  //   if (req) {
  //     setOneRequest(req);
  //   }
  // };

  const positionFinder = (req: RequestWithBookAndUser) => {
    return req.book.requests.filter(
      (currRequest) =>
        currRequest.requestedOn < req.requestedOn &&
        currRequest.status === RequestStatus.Hold
    ).length;
  };

  const deleteReq = async (req: BookRequest) => {
    await deleteRequest(req.id);
    if (req) {
      setOneRequest(req);
    }
  };

  const sortByDate = (a: BookRequest, b: BookRequest) => {
    return a.requestedOn > b.requestedOn ? 1 : -1;
  };

  // functionality for forcing wait on loans coming off the waitlist to be moved to waitlist
  // const markAsDone = async (request: RequestWithBookAndUser) => {
  //   const currentDate = new Date();
  //   try {
  //     await updateReq({
  //       ...request,
  //       status: RequestStatus.Pickup,
  //       returnedBy: currentDate,
  //     });
  //     setConfirmPopup({
  //       type: ConfirmPopupTypes.BORROWED,
  //       action: ConfirmPopupActions.MARK,
  //       success: true,
  //     });
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (error) {
  //     setConfirmPopup({
  //       type: ConfirmPopupTypes.RETURNED,
  //       action: ConfirmPopupActions.MARK,
  //       success: false,
  //     });
  //   }
  // };

  // const requestFilter = (request: RequestWithBookAndUser) => {
  //   const currAvailCopies = getAvailableCopies(request.book);
  //   if (currAvailCopies > 0) {
  //     markAsDone(request);
  //   }
  //   return request;
  // };

  const removeHold = async (
    request: BookRequest & { user: User; book: Book }
  ) => {
    try {
      await deleteReq(request);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [oneRequest]);

  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        Manage holds
      </h1>
      <SearchBar
        button={null}
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
                Copy
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Waitlist Position
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                Requested On
              </th>
              <th className="w-1/6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {subsetRequest.sort(sortByDate).map((request, index) => (
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
                  {getAvailableCopies(request.book)} of {request.book?.copies}
                </td>

                <td className="text-black">{positionFinder(request) + 1}</td>

                <td className="text-black">
                  {dateToTimeString(request.requestedOn)}
                </td>

                <td>
                  <div className="flex justify-center items-center">
                    {/* Add in the functionality for waitlist position when it becomes available */}
                    <CommonButton
                      label="Remove Hold"
                      onClick={async () => {
                        await removeHold(request);
                      }}
                      altTextStyle="text-white"
                      altStyle="bg-[#C00F0C] border-0"
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
