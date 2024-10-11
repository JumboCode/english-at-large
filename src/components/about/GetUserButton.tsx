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
        const user: User = await getOneUser("username");
        console.log("getting one user");
        console.log(user)
      } catch (err) {
        console.log("error bro");
        setError("Failed to get user by id");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div>
        <button onClick={handleGetUser} disabled={loading}>
          {loading ? "Getting..." : "Get single User"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  };
  
  export default GetOneUserButton;