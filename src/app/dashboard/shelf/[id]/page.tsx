"use client";
import React, { useEffect, useState, use } from "react";
import { getOneUser } from "@/lib/api/users";
import { User, BookRequest, Book } from "@prisma/client";
import Image from "next/image";
import imageToAdd from "../../../../assets/images/harry_potter.jpg";
// import BookInfo from "@/components/common/BookInfo";
// import Loans from "../../loans/page";
import { getRequests } from "@/lib/api/requests";
import Tag from "@/components/tag";
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
  }, [params]);

  useEffect(() => {
    if (!user) return;

    const fetchLoans = async () => {
      const allRequests = await getRequests();
      setRequests(allRequests ?? []);
    };

    fetchLoans();
  }, [user]);

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

  const subsetRequests = structuredClone(requests).filter((requests) =>
    requests.userId.includes(user.id)
  );

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
            {subsetRequests.length} out of 10
          </div>
        </div>
        <div className="bg-[#F6FAFD] pt-32 p-4 text-gray-500"> 
          <div className="text-gray-500"> Holds </div>
          {/* TODO: update holds number */}
          <div className="text-xl font-semibold text-black">
            0 out of 10
          </div>
        </div>
      </div>

      <div>
        <div className="font-[family-name:var(--font-rubik)] mb-5 mt-10"> Your loans </div>
        <ul>
          {subsetRequests.map((request) => (
            <li key={request.id}>
              <div className="w-1/2 grid grid-cols-3 rounded-md border-2 border-[#D9D9D9]">
                <div className="m-5">
                  <Image
                    src={request.book.coverURL || imageToAdd.src}
                    alt="Book Cover"
                    width={200}
                    height={300}
                    className="object-fill"
                  />
                </div>
                <div className="col-span-2 font-[family-name:var(--font-rubik)] mt-10">
                <div className="text-xl font-[family-name:var(--font-rubik)] font-semibold">
                      {request.book.title}
                    </div>
                    <div className="font-[family-name:var(--font-rubik)]">
                      by {request.book.author}
                    </div>
                    {request.book.skills.map((skill, index) => (
                      <Tag key={index} label={skill} />
                    ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shelf;
