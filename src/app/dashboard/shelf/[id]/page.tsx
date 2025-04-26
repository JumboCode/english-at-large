"use client";
import React, { useEffect, useState, use } from "react";
import { getOneUser } from "@/lib/api/users";
import { RequestStatus } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import { getUserRequests } from "@/lib/api/requests";
import {
  MAX_REQUESTS,
  RequestWithBookAndUser,
  UserWithRequests,
} from "@/lib/util/types";
type Params = Promise<{ id: string }>;

const Shelf = (props: { params: Promise<Params> }) => {
  const params = use(props.params);
  const [user, setUser] = useState<UserWithRequests | null>(null);

  const [loans, setLoans] = useState<RequestWithBookAndUser[]>([]);

  const [holds, setHolds] = useState<RequestWithBookAndUser[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getOneUser((await params).id);
      setUser(user || null);
    };
    fetchUser();
  }, [params]);

  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      const allUserRequests = await getUserRequests(user.id);
      const userLoans = allUserRequests?.filter(
        (request) =>
          request.status === RequestStatus.Requested ||
          request.status === RequestStatus.Borrowed ||
          request.status === RequestStatus.Pickup
      );
      const userHolds = allUserRequests?.filter(
        (request) => request.status === RequestStatus.Hold
      );
      setLoans(userLoans ?? []);
      setHolds(userHolds ?? []);
    };
    fetchRequests();
  }, [user]);

  if (user == null) return null;

  return (
    <div className="m-10">
      <div className="text-3xl font-[family-name:var(--font-rubik)] font-semibold mb-8">
        {" "}
        <p> Hi, {user.name?.split(" ")[0]} </p>
      </div>

      <div className="grid grid-cols-2 gap-4 font-[family-name:var(--font-rubik)]">
        <div className="bg-[#F6FAFD] p-4 ">
          <div className="text-gray-500"> Loans </div>
          <div className="text-xl font-semibold text-black">
            {loans.length} out of {MAX_REQUESTS}
          </div>
        </div>
        <div className="bg-[#F6FAFD] p-4 text-gray-500">
          <div className="text-gray-500"> Holds </div>
          {/* TODO: update holds number */}
          <div className="text-xl font-semibold text-black">
            {holds.length} out of {MAX_REQUESTS}
          </div>
        </div>
      </div>

      {loans.length > 0 && (
        <div>
          <div className="font-[family-name:var(--font-rubik)] mb-5 mt-10">
            {" "}
            Your loans{" "}
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((request) => (
              <li key={request.id} className="h-full">
                <div className="h-full p-4 rounded-md border-2 border-[#D9D9D9]">
                  <BookInfo
                    book={request.book}
                    user={user}
                    onDelete={() => {
                      setLoans((prevLoans) =>
                        prevLoans.filter((r) => r.id !== request.id)
                      );
                      setHolds((prevHolds) =>
                        prevHolds.filter((r) => r.id !== request.id)
                      );
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {holds.length > 0 && (
        <div className="pb-[100px]">
          <div className="font-[family-name:var(--font-rubik)] mb-5 mt-10">
            {" "}
            Your holds{" "}
          </div>
          <ul className="flex flex-wrap gap-4">
            {holds.map((request) => (
              <li key={request.id} className="w-1/2">
                <div className="p-4 rounded-md border-2 border-[#D9D9D9] m-2">
                  <BookInfo
                    book={request.book}
                    user={user}
                    onDelete={() => {
                      // Remove from loans or holds after cancel
                      setLoans((prevLoans) =>
                        prevLoans.filter((r) => r.id !== request.id)
                      );
                      setHolds((prevHolds) =>
                        prevHolds.filter((r) => r.id !== request.id)
                      );
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {holds.length == 0 && loans.length == 0 && (
        <div className="font-[family-name:var(--font-rubik)] mb-5 mt-10">
          You currently have no loans or holds
        </div>
      )}
    </div>
  );
};

export default Shelf;
