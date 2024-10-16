"use client";
import { useState } from "react";
import { getRequests } from "../../lib/api/requests"; // Adjust the path as necessary
import { emptyRequest } from "@/lib/util/types";
import { Request as BookRequest } from "@prisma/client";

const GetRequestButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("request");
      await getRequests();
      alert("Request gotten successfully!");
    } catch (err) {
      console.log("error");
      setError("Failed to get request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGetRequest} disabled={loading}>
        {loading ? "Getting..." : "Got Request"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetRequestButton;

