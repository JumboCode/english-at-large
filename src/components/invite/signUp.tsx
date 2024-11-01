"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@prisma/client";
import { emptyUser } from "@/lib/util/types";
import { useSignUp } from "@clerk/nextjs";
import { createUser } from "../../lib/api/users";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user } = useUser();
  const [attemptedSignup, setAttemptedSignup] = useState<boolean>(false);

  const router = useRouter();
  const inviteToken = useSearchParams().get("__clerk_ticket");

  useEffect(() => {
  // const createNeonUser = () => {
    if (user) {
      const metadata = user.publicMetadata ?? {};

      const newUser = {
        ...emptyUser, 
        name: metadata["name"] ? String(metadata["name"]) : "" , 
        role: (metadata["role"] as UserRole),
        email: user.primaryEmailAddress?.emailAddress ?? "", 
      } 

      createUser(newUser);
    } 
  // };
  }, [user]);

  const clerkSignup = useCallback(async () => {
    
    if (!inviteToken) router.push("/login");
    
    if (!isLoaded || attemptedSignup || !inviteToken) return;

    try {
      const attempt = await signUp.create({
        strategy: "ticket",
        ticket: inviteToken,
      });

      setEmail(attempt.emailAddress || "");
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
      }

      setAttemptedSignup(true); // Ensure only one attempt
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage(
        "Invite token invalid or already used. Please check your invite."
      );
      setAttemptedSignup(true); // Prevent further attempts
      setTimeout(() => {
        router.push("/login")
      }, 3000);
    }
  }, [attemptedSignup, inviteToken, isLoaded, setActive, signUp, router]);

  useEffect(() => {
    if (!attemptedSignup) {
      clerkSignup();
    }
  }, [attemptedSignup, clerkSignup, isLoaded]);

  const onSubmit = async () => {
    try {
      if (signUp != null) {
        const attempt = await signUp.update({ password }); //finishes sign up in clerk
        if (attempt.status === "complete") {
          await setActive({ session: attempt.createdSessionId }); //wait until user is created

          // for (let i = 0; i < 20; i++) {
          //   user?.reload(); 

          //   if(isSignedIn) { //USER DOES NOT LOAD
          //     console.log("User changed to Active")
          //     break;
          //   }

          //   await new Promise((resolve) => setTimeout(resolve, 500)); // wait 1000ms
          //   console.log("time in loop: ", i)
          // }
          // if (!user) {
          //   throw "timeout: user took too long to load in CLERK"
          // }
          // createNeonUser(); //creates user in neon
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  if (!inviteToken) {
    return <p>No invite found.</p>;
  } else if (!email) {
    return (
      <div>
        <p>{errorMessage ? errorMessage : "Loading..."}</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>Email: {email}</p>
        <p>Password:</p>
        <input
          type="password"
          name="password"
          className="text-black"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <p>Confirm Password:</p>
        <input type="password" name="confirm" className="text-black" />
        <br />
        <p>{errorMessage}</p>
        <br />
        <button onClick={onSubmit}>Sign Up</button>
      </div>
    );
  }
}



export default SignUp;