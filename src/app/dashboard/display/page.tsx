
"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/api/books";
import { Book, BookLevel, BookSkills, BookStatus } from "@prisma/client";
import BookInfo from "@/components/common/BookInfo";
import SearchBar from "@/components/SearchBar";
import FilterPopup from '@/components/common/FilterPopup';


const book = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [skills, setSkills] = useState<BookSkills[]>([]);
    const [levels, setLevels] = useState<BookLevel[]>([]);
    const [status, setStatus] = useState<BookStatus[]>([]);
    const [sortBooks, setSortBooks] = useState<string>("By Title");

    // const [filters, setFilters] = useState<(BookSkills | BookLevel)[]>([]);

    const toggleFilterPopup = () => {
      setIsFilterOpen(!isFilterOpen);
    };
    
    const filtered = (book : Book) => {
      if(skills.length == 0 && levels.length == 0) {
        return book;
      } else if (skills.length == 0 && levels.includes(book.level)) {
        return book;
      } else if (levels.length == 0 && skills.some(skill => book.skills.includes(skill))) {
        return book;
      } else if (levels.includes(book.level) && skills.some(skill => book.skills.includes(skill))){
        return book;
      }
    }

    const sortingBooks = () => {
      if (sortBooks === "By Title") {
        const sorted = [...books].sort((a, b) => {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          if (a.author < b.author) return -1;
          return a.author > b.author ? 1 : 0;
        });
        setBooks(sorted);
      } else if (sortBooks === "By Author") {
        const sorted = [...books].sort((a, b) => {
          if (a.author < b.author) return -1;
          if (a.author > b.author) return 1;
          if (a.title < b.title) return -1;
          return a.title > b.title ? 1 : 0;
        });
        setBooks(sorted);
      } else {
        const sorted = [...books].sort((a, b) => {
          if (a.releaseDate && b.releaseDate) {
            return a.releaseDate < b.releaseDate ? -1 : 1;
          }
          return a.releaseDate ? 1 : 0;
        });
        setBooks(sorted);
      }
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
              console.error("Failed to get all books");
            }
          };
        fetchData();
    }, []
    )

    useEffect(() => {
      sortingBooks();
    }, [books, sortBooks]);

  return (
    <div>
      <SearchBar filterOnPress={toggleFilterPopup} />
      <FilterPopup isOpen={isFilterOpen} toggle={toggleFilterPopup} skills={skills} setSkills={setSkills} levels={levels} setLevels={setLevels} status={status} setStatus={setStatus} sortBook={sortBooks} setSortBook={setSortBooks}/>
    <div className="p-4 bg-gray-100">
      <div className = "text-left">
        <div className = "whitespace-normal"> 
          <text className= "text-sm text-slate-500">{books.length} {"titles"}</text>
        </div>
      </div>
     <ul  className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {books.filter(book => filtered(book)).map((book, index) => (
          <li
          key={index}
        >
          <div>
            <div className="p-4 bg-white shadow-md rounded-md hover:bg-blue-100 transition duration-200">
              <BookInfo book={book} />
            </div>
          </div>
        </li>
       ))}
     </ul>
   </div>
   </div>
  )
}

export default book
