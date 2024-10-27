// TESTING COMPONENT

"use client";
import { useState } from "react";
import { createUser } from "@/lib/api/users";
import { newEmptyUser } from "@/lib/util/types";

const CreateUserButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);

    try {
      // create user without id

      const newUser = await createUser(newEmptyUser);
      if (newUser) alert("User created successfully!");
      else {
        throw new Error();
      }
    } catch (err) {
      setError("Failed to create user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCreateUser} disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateUserButton;
