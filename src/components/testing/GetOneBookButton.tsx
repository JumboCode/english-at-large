"use client";
import { useState } from "react";
import { getOneBook } from "@/lib/api/books"; // Adjust the path as necessary
// import { emptyBook } from "@/lib/util/types";

const GetOneBookButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetOneBook = async () => {
    setLoading(true);
    setError(null);

    try {
      const book = await getOneBook("yes");
      if (book) alert("Book getOne successfully!");
      else throw error;
    } catch (err) {
      setError("Failed to fetch book");
      console.error(err);
    } finally {
      setLoading(false);
    }
    console.log("inside handleGetONeBOok");
  };

  return (
    <div>
      <button onClick={() => handleGetOneBook()} disabled={loading}>
        {loading ? "Updating..." : "getOne Book"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetOneBookButton;
