"use client";
import { useState } from "react";
import { deleteRequest } from "@/lib/api/requests";

const DeleteRequestButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteRequest(9);

      alert("Request deleted successfully!");
    } catch (err) {
      console.log("error");
      setError("Failed to delete request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDeleteRequest} disabled={loading}>
        {loading ? "Deleting..." : "Delete Request"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteRequestButton;
