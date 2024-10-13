// TESTING COMPONENT

"use client";
import { useState } from "react";
import { deleteUser } from "@/lib/api/users";
import { User } from "@prisma/client";

const DeleteUserButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleDeleteUser = async () => {
      setLoading(true);
      setError(null);
  
      try {
        // delete User by id
        await deleteUser("username");
        console.log("Deleting user");
      } catch (err) {
        console.log("error bro");
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