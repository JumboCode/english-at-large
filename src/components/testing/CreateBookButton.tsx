"use client";
import { useState } from "react";
import { createBook } from "@/lib/api/books"; // Adjust the path as necessary
import { newEmptyBook } from "@/lib/util/types";

const CreateBookButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBook = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace these with your book details
      // cast as book w/o id since we can't have an existing id when creating a book
      await createBook(newEmptyBook);
      alert("Book created successfully!");
    } catch (err) {
      setError("Failed to create book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="flex flex-row items-center gap-2 min-w-max p-3 rounded-lg border border-dark-blue bg-dark-blue"
        onClick={handleCreateBook}
        disabled={loading}
      >
        <p className="text-sm">{loading ? "Creating..." : "Create Book"}</p>
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateBookButton;
