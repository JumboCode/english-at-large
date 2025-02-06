"use client";
import { useState } from "react";
import { getAllResources } from "@/lib/api/resources"; // Adjust the path as necessary

const GetAllResourceButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllResource = async () => {
    setLoading(true);
    setError(null);

    try {
      const resources = await getAllResources();
      alert("Resource getAll successfully!");
      console.log(resources);
    } catch (err) {
      setError("Failed to fetch Resources");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => handleGetAllResource()} disabled={loading}>
        {loading ? "Updating..." : "getAll Resources"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetAllResourceButton;
