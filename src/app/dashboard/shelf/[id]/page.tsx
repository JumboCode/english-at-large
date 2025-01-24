"use client";
import React, { useEffect, useState, use } from "react";
import { getOneUser } from "@/lib/api/users";
import { User, BookRequest, Book } from "@prisma/client";
// import BookInfo from "@/components/common/BookInfo";
// import Loans from "../../loans/page";
import { getRequests } from "@/lib/api/requests";

type Params = Promise<{ id: string }>;

const Shelf = (props: { params: Promise<Params> }) => {
  const params = use(props.params);
  const [user, setUser] = useState<User | null>(null);
  // const [books, setBooks] = useState<Book[]>([]);
  // const [requests, setRequests] = useState<Request>();

  const [requests, setRequests] = useState<
    (BookRequest & { user: User; book: Book })[]
  >([]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getOneUser((await params).id);
      setUser(user || null);
    };
    fetchUser();

    const fetchLoans = async () => {
      if (!user) return;
      const allRequests = await getRequests();
      setRequests(allRequests ?? []);
    };

    fetchLoans();
  }, [params, user]);

  if (user == null) return null;

  // const filterRequest = useCallback(
  //   (book: Book) => {
  //     return (
  //       (skills.length === 0 ||
  //         skills.some((skill) => book.skills.includes(skill))) &&
  //       (levels.length === 0 || levels.includes(book.level))
  //     );
  //   },
  //   [levels, skills]
  // );

  const subsetRequests = structuredClone(requests)
    .filter((requests) => requests.userId.includes(user.id));
    // .filter((user) => filterRequest(user));

  return (
    <div>
      <div>
        {" "}
        <p> Hi, {user.name} </p>
      </div>

      <div className="flex grid grid-cols-4 gap-4">
        <div>box 1 loans</div>
        <div>box 2 holds</div>
      </div>

      <div>
        <div> Your loans </div>
        <ul>
          {subsetRequests.map((request) => (
            <li key={request.id}>
              {request.user.name} borrowed {request.book.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shelf;
