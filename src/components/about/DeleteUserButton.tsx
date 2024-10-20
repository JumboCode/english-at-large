// TESTING COMPONENT

"use client";
import { useState } from "react";
import { deleteUser } from "@/lib/api/users";

const DeleteUserButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteUser = async () => {
    setLoading(true);
    setError(null);

    try {
      // delete User by id
      await deleteUser("cm2gxn935000313rswgxpnmu2");
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDeleteUser} disabled={loading}>
        {loading ? "Deleting..." : "Delete User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteUserButton;
