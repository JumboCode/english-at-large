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

      const { id, ...emptyUserNoId } = newEmptyUser;
      await createUser(emptyUserNoId);
      console.log(emptyUserNoId);
      alert("User created successfully!");
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
