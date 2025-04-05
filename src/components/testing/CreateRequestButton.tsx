"use client";
import { useState } from "react";
import { createRequest } from "@/lib/api/requests";
import { newEmptyRequest } from "@/lib/util/types";

const CreateRequestButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      await createRequest(newEmptyRequest);

      alert("Request created successfully!");
    } catch (err) {
      setError("Failed to create request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCreateRequest} disabled={loading}>
        {loading ? "Creating..." : "Create Request"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateRequestButton;
