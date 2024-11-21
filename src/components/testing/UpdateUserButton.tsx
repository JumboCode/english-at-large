// TESTING COMPONENT

"use client";
import { useState } from "react";
import { updateUser } from "@/lib/api/users";
import { getOneUser } from "@/lib/api/users";
import { User } from "@prisma/client";

const UpdateUserButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUser = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateUser(new_update);
      console.log(await getOneUser("cm2f3d47n0001sl8z4mv0xh8x"));
    } catch (err) {
      setError("Failed to update user by id");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpdateUser} disabled={loading}>
        {loading ? "Updating..." : "Update User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export const new_update: User = {
  id: "cm2f3d47n0001sl8z4mv0xh8x",
  name: "U1_UPDATE",
  email: "u1@gmail.com",
  role: "Admin",
  clerkId: "placeholder",
  createdAt: new Date("2020-01-01T00:00:00.000Z"), // should be autogenerated
  updatedAt: new Date("2020-01-01T00:00:00.000Z"),
  pending: false,
  inviteID: "",
};

export default UpdateUserButton;
