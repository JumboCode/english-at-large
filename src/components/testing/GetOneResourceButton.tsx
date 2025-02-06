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
      const resource = await getOneResource("cm6sgda850002mi4n2nezx3dt");
      if (resource) {
        alert("Resource getOne successfully!");
        console.log(resource);
      } else throw error;
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
