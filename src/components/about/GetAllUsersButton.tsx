// TESTING COMPONENT

"use client";
import { useState } from "react";
import { getAllUsers } from "@/lib/api/users";
import { User } from "@prisma/client";

const GetAllUsersButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleGetUsers = async () => {
      setLoading(true);
      setError(null);
  
      try {
        // create user without id
        const users: User[] = await getAllUsers();
        console.log("getting all users");
        console.log(users)
      } catch (err) {
        console.log("error bro");
        setError("Failed to get all users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div>
        <button onClick={handleGetUsers} disabled={loading}>
          {loading ? "Creating..." : "Get all users"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  };
  
  export default GetAllUsersButton;