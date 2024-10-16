"use client";
import { useState } from "react";
import { createRequest } from "../../lib/api/requests"; // Adjust the path as necessary
import { emptyRequest } from "@/lib/util/types";
import { Request as BookRequest } from "@prisma/client";

const CreateRequestButton = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("request");
      await createRequest(emptyRequest as Omit<BookRequest, "id">);
      alert("Request created successfully!");
    } catch (err) {
      console.log("error");
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

