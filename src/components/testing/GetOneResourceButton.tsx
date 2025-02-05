"use client";
import { useState } from "react";
import { getOneResource } from "@/lib/api/resources"; // Adjust the path as necessary

const GetOneResourceButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetOneResource = async () => {
    setLoading(true);
    setError(null);

    try {
      const resource = await getOneResource("cm6sg3o7s0000mi4nfxvk38qz");
      if (resource) alert("Resource getOne successfully!");
      else throw error;
    } catch (err) {
      setError("Failed to fetch resource");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => handleGetOneResource()} disabled={loading}>
        {loading ? "Updating..." : "getOne Resource"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetOneResourceButton;
