"use client";
import React, { useEffect, useState } from "react";
import { getAllBooks } from "@/lib/api/books";
import { getRequests } from "@/lib/api/requests";
import { Book, BookRequest, User } from "@prisma/client";
import SearchBar from "@/components/SearchBar";
import CommonDropdown from "../forms/Dropdown";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";

const BookCatalog = () => {
  const [books, setBooks] = useState<Book[]>([]);
  //   const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchData, setSearchData] = useState("");
  const [requests, setRequests] = useState<
    (BookRequest & { user: User; book: Book })[]
  >([]);

  const subsetBooks = structuredClone<Book[]>(books).filter((book) =>
    book.title.toLowerCase().includes(searchData)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBooks = await getAllBooks();
        if (allBooks) {
          setBooks(allBooks);
        }
      } catch (err) {
        console.error("Failed to get all books");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getReqs = async () => {
      const allRequests = await getRequests();
      setRequests(allRequests ?? []);
    };

    getReqs();
  }, []);

  const countBookRequests = (
    requests: (BookRequest & { user: User; book: Book })[],
    id: number
  ) => {
    return requests.filter((request) => request.book.id === id).length;
  };

  const countUniqueUsers = (
    requests: (BookRequest & { user: User; book: Book })[],
    id: number
  ): number => {
    const uniqueUsers = new Set<string>();

    requests.forEach(({ user, book }) => {
      if (book.id === id) {
        uniqueUsers.add(user.id);
      }
    });

    return uniqueUsers.size;
  };

  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        Dashboard
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
        placeholderText="Search by book title"
        setSearchData={setSearchData}
      />
      <div className="px-16">
        <table className="table-auto bg-white w-full font-family-name:var(--font-geist-sans)]">
          <thead>
            <tr className="bg-gray-100 h-[50px]">
              <th className="w-3/6  text-left text-text-default-secondary px-3">
                Book title
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                No. of times borrowed
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Unique borrowers
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                Date added
              </th>
              <th className="w-1/6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {subsetBooks
              //   .filter(requestFilter)
              //   .sort(sortByDate)
              .map((book, index) => (
                <tr key={index} className="bg-white h-16">
                  <td className="underline px-3" style={{ color: "#202D74" }}>
                    <Link href={`books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>
                    <p>{countBookRequests(requests, book.id)}</p>
                  </td>

                  <td>
                    <p>{countUniqueUsers(requests, book.id)}</p>
                  </td>

                  <td>{dateToTimeString(book.createdAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookCatalog;
