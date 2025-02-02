"use client";
import React, { useEffect, useState, use } from "react";
import { getOneUser } from "@/lib/api/users";
import { User, BookRequest, Book } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import { getUserRequests } from "@/lib/api/requests";
import { MAX_REQUESTS } from "@/lib/util/types";
type Params = Promise<{ id: string }>;

const Shelf = (props: { params: Promise<Params> }) => {
  const params = use(props.params);
  const [user, setUser] = useState<User | null>(null);

  const [requests, setRequests] = useState<
    (BookRequest & { user: User; book: Book })[]
  >([]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getOneUser((await params).id);
      setUser(user || null);
    };
    fetchUser();
  }, [params]);

  useEffect(() => {
    if (!user) return;

    const fetchLoans = async () => {
      const userRequests = await getUserRequests(user.id);
      setRequests(userRequests ?? []);
    };

    fetchLoans();
  }, [user]);

  if (user == null) return null;

  return (
    <div className="m-10">
      <div className="text-3xl font-[family-name:var(--font-rubik)] font-semibold mb-8">
        {" "}
        <p> Hi, {user.name?.split(" ")[0]} </p>
      </div>

      <div className="grid grid-cols-4 gap-4 font-[family-name:var(--font-rubik)]">
        <div className="bg-[#F6FAFD] pt-32 p-4 "> 
          <div className="text-gray-500"> Loans </div>
          <div className="text-xl font-semibold text-black">
            {requests.length} out of {MAX_REQUESTS}
          </div>
        </div>
        <div className="bg-[#F6FAFD] pt-32 p-4 text-gray-500"> 
          <div className="text-gray-500"> Holds </div>
          {/* TODO: update holds number */}
          <div className="text-xl font-semibold text-black">
            0 out of {MAX_REQUESTS}
          </div>
        </div>
      </div>

      <div>
        <div className="font-[family-name:var(--font-rubik)] mb-5 mt-10"> Your loans </div>
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <div className="w-1/2 p-4 rounded-md border-2 border-[#D9D9D9] m-2">
                <BookInfo book={request.book} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shelf;
