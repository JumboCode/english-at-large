"use client";
import { useState } from "react";
import { getRequests } from "../../lib/api/requests"; 

const GetRequestButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("request");
      const newRequest = await getRequests();
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
        {loading ? "Getting..." : "Get Request"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetRequestButton;

