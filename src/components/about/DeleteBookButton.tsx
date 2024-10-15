"use client";
import { useState } from "react";
import { deleteBook } from "@/lib/api/books"; // Adjust the path as necessary
import { emptyBook } from "@/lib/util/types";
// import { Book } from "@prisma/client";

const DeleteBookButton = () => {
  console.log("IN DELETE BOOK BUTTOn")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteBook = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("book");
      // Replace these with your book details
      // cast as book w/o id since we can't have an existing id when creating a book
      emptyBook.id = 0;
      emptyBook.author = "";
      await deleteBook(emptyBook);
      // alert("Book update successfully!");
    } catch (err) {
      console.log("error bro");
      setError("Failed to delete book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDeleteBook} disabled={loading}>
        {loading ? "Deleting..." : "Delete Book"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteBookButton;
