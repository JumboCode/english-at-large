import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getOneUserByClerkid } from "../api/users";
import { User } from "@prisma/client";

/**
 * a hook that grabs the currently authenticated user from Clerk and returns the corresponding user from neon.tech.
 *
 * @returns the currently signed in user (neon.tech)
 * @notes use this rather than the useUser hook from Clerk, since we need to grab other information from the user, like their current holds.
 *
 */
const useCurrentUser = () => {
  const { user } = useUser(); // Clerk user
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const userClerkId = user.id;
        const fetchedUser = await getOneUserByClerkid(userClerkId);
        setCurrentUser(fetchedUser);
      }
    };

    // Call fetchUser whenever `user` changes
    if (user) {
      fetchUser();
    } else {
      setCurrentUser(null); // Optionally reset if no user is logged in
    }
  }, [user]);

  return currentUser; // Return the current user data
};

export default useCurrentUser;
