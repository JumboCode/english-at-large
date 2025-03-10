// TESTING COMPONENT

"use client";
import { useState } from "react";
import { getAllUsers } from "@/lib/api/users";

const GetAllUsersButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      await getAllUsers();
    } catch (err) {
      setError("Failed to get all users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGetUsers} disabled={loading}>
        {loading ? "Getting..." : "Get All Users"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetAllUsersButton;
