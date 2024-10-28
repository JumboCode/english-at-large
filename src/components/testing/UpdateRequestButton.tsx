"use client";
import { useState } from "react";
import { updateRequest } from "@/lib/api/requests";
import { emptyRequest } from "@/lib/util/types";

const UpdateRequestButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateRequest(emptyRequest);

      alert("Request updated successfully!");
    } catch (err) {
      console.log("error");
      setError("Failed to update request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpdateRequest} disabled={loading}>
        {loading ? "Updating..." : "Update Request"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpdateRequestButton;
