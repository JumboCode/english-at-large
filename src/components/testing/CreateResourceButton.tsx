"use client";
import { useState } from "react";
import { createResource } from "@/lib/api/resources"; // Adjust the path as necessary
import { newEmptyResource } from "@/lib/util/types";

const CreateResourceButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateResource = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace these with your resource details
      // cast as resource w/o id since we can't have an existing id when creating a resource
      await createResource(newEmptyResource);
      alert("Resource created successfully!");
    } catch (err) {
      setError("Failed to create resource");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCreateResource} disabled={loading}>
        <p>{loading ? "Creating..." : "Create Resource"}</p>
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateResourceButton;
