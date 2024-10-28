
"use client";
//import React from 'react'
import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/api/books";
import { Book } from "@prisma/client";

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
    </div>

    //   <button onClick={() => handleGetAllBooks()} disabled={loading}>
    //     {loading ? "Updating..." : "getAll Book"}
    //   </button>
    //   {error && <p style={{ color: "red" }}>{error}</p>}
    // </div>
  )
}

export default book
