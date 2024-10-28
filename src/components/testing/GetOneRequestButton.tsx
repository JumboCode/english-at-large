"use client";
import { useState } from "react";
import { getOneRequest } from "../../lib/api/requests";

const GetOneRequestButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const newRequest = await getOneRequest(9);
      console.log(newRequest);
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
        {loading ? "Getting..." : "Get One Request"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetOneRequestButton;
