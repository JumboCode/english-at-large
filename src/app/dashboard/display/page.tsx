
"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/api/books";
import { Book } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import SearchBar from "@/components/SearchBar";


const book = () => {
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect (() => {
        const fetchData = async () => {
            try {
            
              const allBooks = await getAllBooks()
              if (allBooks) {
                setBooks(allBooks);
              }
              console.log(books);
            } catch (err) {
              console.error("Failed to get all users");
            }
          };
        
        fetchData();
    }, []
    )

  return (
    <div>
      <SearchBar />
    <div className="p-4 bg-gray-100">
     <ul className="space-y-2">
       {books.map((book, index) => (
         <li
           key={index}
           className="p-4 bg-black shadow-md rounded-md hover:bg-blue-100 transition duration-200"
         >
           <BookInfo book={book} />
         </li>
       ))}
     </ul>
   </div>
   </div>
  )
}

export default book
