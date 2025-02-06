"use client";
import { useState } from "react";
import { updateResource } from "@/lib/api/resources"; // Adjust the path as necessary
import { newEmptyResource } from "@/lib/util/types";

const UpdateResourceButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateResource = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace these with your resource details
      // cast as resource w/o id since we can't have an existing id when creating a resource
      await updateResource({id: "cm6sg3o7s0000mi4nfxvk38qz", ...newEmptyResource});
      alert("Resource update successfully!");
    } catch (err) {
      setError("Failed to getOne resource");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpdateResource} disabled={loading}>
        {loading ? "Updating..." : "Update Resource"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpdateResourceButton;
