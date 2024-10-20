// TESTING COMPONENT

"use client";
import { useState } from "react";
import { getOneUser } from "@/lib/api/users";
import { User } from "@prisma/client";

const GetOneUserButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const user: User = await getOneUser("cm2f3a8ra0000sl8zdb10q3d1");
    } catch (err) {
      setError("Failed to get user by id");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGetUser} disabled={loading}>
        {loading ? "Getting..." : "Get Single User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GetOneUserButton;
