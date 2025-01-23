"use client";
import { useState } from "react";
import { updateBook } from "@/lib/api/books"; // Adjust the path as necessary
import { emptyBook } from "@/lib/util/types";

const UpdateBookButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateBook = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace these with your book details
      // cast as book w/o id since we can't have an existing id when creating a book
      await updateBook(emptyBook);
      alert("Book update successfully!");
    } catch (err) {
      setError("Failed to getOne book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpdateBook} disabled={loading}>
        {loading ? "Updating..." : "Update Book"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpdateBookButton;
