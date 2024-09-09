"use client";
import { useState } from "react";
import { createBook } from "@/lib/api/books"; // Adjust the path as necessary

const CreateBookButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBook = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("book");
      // Replace these with your book details
      const newBook = { name: "New Book Title", owner: "Author Name" };
      await createBook(newBook);
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
