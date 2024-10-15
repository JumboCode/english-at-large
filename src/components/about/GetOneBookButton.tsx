"use client";
import { useState } from "react";
import { getOneBook } from "@/lib/api/books"; // Adjust the path as necessary
// import { emptyBook } from "@/lib/util/types";

const GetOneBookButton = () => {
  console.log("IN getOne BOOK BUTTOn")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetOneBook = async () => {

    setLoading(true);
    setError(null);

    try {
      console.log("book");
      const gotOneBook = await getOneBook(3);
      console.log(gotOneBook.author)
      // alert("Book getOne successfully!");
    } catch (err) {
      console.log("error bro");
      setError("Failed to fetch book");
      console.error(err);
    } finally {
      setLoading(false);
    }
    console.log("inside handleGetONeBOok")
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
