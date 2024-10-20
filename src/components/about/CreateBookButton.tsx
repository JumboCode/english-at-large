"use client";
import { useState } from "react";
import { createBook } from "@/lib/api/books"; // Adjust the path as necessary
import { emptyBook } from "@/lib/util/types";
import { Book } from "@prisma/client";

const CreateBookButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBook = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("book");
      // Replace these with your book details
      // cast as book w/o id since we can't have an existing id when creating a book
      await createBook(emptyBook as Omit<Book, "id">);
      alert("Book created successfully!");
    } catch (err) {
      console.log("error bro");
      setError("Failed to create book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCreateBook} disabled={loading}>
        {loading ? "Creating..." : "Create Book"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateBookButton;
