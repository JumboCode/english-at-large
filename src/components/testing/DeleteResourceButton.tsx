"use client";
import { useState } from "react";
import { deleteResource } from "@/lib/api/resources"; // Adjust the path as necessary

const DeleteResourceButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteResource = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace these with your resource details
      // cast as resource w/o id since we can't have an existing id when creating a resource
      await deleteResource("cm6sg3o7s0000mi4nfxvk38qz");
      alert("Resource deleted successfully!");
    } catch (err) {
      setError("Failed to delete resource");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDeleteResource} disabled={loading}>
        {loading ? "Deleting..." : "Delete Resource"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteResourceButton;
