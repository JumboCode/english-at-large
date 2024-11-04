
"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/api/books";
import { Book, BookLevel, BookSkills } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import SearchBar from "@/components/SearchBar";
import FilterPopup from '@/components/common/FilterPopup';


const book = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [levels, setLevels] = useState<string[]>([]);

    const [filters, setFilters] = useState<(BookSkills | BookLevel)[]>([]);

    const toggleFilterPopup = () => {
      setIsFilterOpen(!isFilterOpen);
    };
    
    const filtered = () => {
      
    }

    useEffect (() => {
        const fetchData = async () => {
            try {
            
              const allBooks = await getAllBooks()
              if (allBooks) {
                setBooks(allBooks);
              }
              console.log(books);
            } catch (err) {
              console.error("Failed to get all books");
            }
          };
        fetchData();
    }, []
    )

  return (
    <div>
      <SearchBar filterOnPress={toggleFilterPopup} />
      <FilterPopup isOpen={isFilterOpen} toggle={toggleFilterPopup} filters={filters} setFilters={setFilters}/>
    <div className="p-4 bg-gray-100">
      <div className = "text-left">
        <div className = "whitespace-normal"> 
          <text className= "text-sm text-slate-500">{books.length} {"titles"}</text>
        </div>
      </div>
     <ul  className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {books.map((book, index) => (
          <li
          key={index}
        >
          {(levels.length == 0 || levels.includes(book.level.replace("_"," "))) && (skills.length == 0 || skills.filter(element => book.skills.includes())) ? (
            
            // Implement Later: " && (skills.length == 0 || skills.filter(element => book.skills.includes(element)))"
          <div>
            <div className="p-4 bg-white shadow-md rounded-md hover:bg-blue-100 transition duration-200">
              <BookInfo book={book} />
            </div>
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
