import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getOneUserByClerkid } from "../api/users";
import { User } from "@prisma/client";

// Custom hook to fetch current user data
const useCurrentUser = () => {
  const { user } = useUser(); // Clerk user
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const userClerkId = user.id;
        const fetchedUser = await getOneUserByClerkid(userClerkId);
        console.log("fetched: ", fetchedUser);
        setCurrentUser(fetchedUser);
      }
    };

    // Call fetchUser whenever `user` changes
    if (user) {
      console.log("USER GOT!!!!, ", user);
      fetchUser();
    } else {
      console.log("user not got");
      setCurrentUser(null); // Optionally reset if no user is logged in
    }
  }, [user]);

  console.log("current user: ", currentUser);
  return currentUser; // Return the current user data
};

export default useCurrentUser;
