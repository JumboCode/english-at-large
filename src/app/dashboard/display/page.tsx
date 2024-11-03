
"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/api/books";
import { Book } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import SearchBar from "@/components/SearchBar";
import FilterPopup from '@/components/common/FilterPopup';


const book = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [levels, setLevels] = useState<string[]>([]);

    const toggleFilterPopup = () => {
      setIsFilterOpen(!isFilterOpen);
    };

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
      <SearchBar filterOnPress={toggleFilterPopup} />
      <FilterPopup isOpen={isFilterOpen} toggle={toggleFilterPopup} skills={skills} setSkills={setSkills} levels={levels} setLevels={setLevels}/>
    <div className="p-4 bg-gray-100">
     <ul className="space-y-2">
       {books.map((book, index) => (
          <li
          key={index}
        >
          {(levels.length == 0 || levels.includes(book.level)) ? (
            // Implement Later: " && (skills.length == 0 || skills.filter(element => book.skills.includes(element)))"
          <div className="p-4 bg-black shadow-md rounded-md hover:bg-blue-100 transition duration-200">
            <BookInfo book={book} />
          </div>
          ) : (
            <div></div>
          )}
        </li>
       ))}
     </ul>
   </div>
   </div>
  )
}

export default book
