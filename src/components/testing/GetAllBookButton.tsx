"use client";
import { useState } from "react";
import { getBooks } from "@/lib/api/books"; // Adjust the path as necessary
// import { emptyBook } from "@/lib/util/types";

const GetAllBookButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllBook = async () => {
    setLoading(true);
    setError(null);

    try {
      const gotBooks = await getBooks();
      console.log("HERE");
      console.log(gotBooks.length);
      alert("Book getAll successfully!");
    } catch (err) {
      console.log("error bro");
      setError("Failed to fetch book");
      console.error(err);
    } finally {
      setLoading(false);
    }
    console.log("inside handleGetONeBOok");
  };

  return (
    <div>
      <button onClick={() => handleGetAllBook()} disabled={loading}>
        {loading ? "Updating..." : "getAll Book"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetAllBookButton;
