"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@prisma/client";
import { emptyUser } from "@/lib/util/types";
import { useSignUp } from "@clerk/nextjs";
import { createUser } from "../../lib/api/users";
import { useUser } from "@clerk/nextjs";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user } = useUser();
  const [attemptedSignup, setAttemptedSignup] = useState<boolean>(false);

  const inviteToken = useSearchParams().get("__clerk_ticket");

  useEffect(() => {
    if (user) {
      const metadata = user.publicMetadata ?? {};

      const newUser = { ...emptyUser };
      newUser.name = metadata["name"] ? String(metadata["name"]) : "";

      const role = metadata["role"];

      if (role === "Admin") {
        newUser.role = UserRole.Admin;
      } else if (role === "Tutor") {
        newUser.role = UserRole.Tutor;
      } else {
        newUser.role = UserRole.Volunteer;
      }

      newUser.email = user.primaryEmailAddress?.emailAddress ?? "";

      createUser(newUser);
    }
  }, [user]);

  const clerkSignup = useCallback(async () => {
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
    }
  }, [attemptedSignup, inviteToken, isLoaded, setActive, signUp]);

  useEffect(() => {
    if (!attemptedSignup) {
      clerkSignup();
    }
  }, [attemptedSignup, clerkSignup, isLoaded]);

  const on_submit = async () => {
    if (password !== confirm) {
      alert("Passwords do not match!");
    } else {
      const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

      if (passwordRegex.test(password)) {
        try {
          if (signUp != null) {
            const attempt = await signUp.update({ password });
            if (attempt.status === "complete") {
              await setActive({ session: attempt.createdSessionId });
            }
          }

          setErrorMessage("");
        } catch (error) {
          console.error("Error updating password:", error);
          setErrorMessage("Error setting Clerk password");
        }
      } else {
        setErrorMessage(
          "Make sure your password has at least 8 characters, including a number, a lowercase letter, an uppercase letter, and a special character."
        );
      }
    }
  };

  if (!inviteToken) {
    return <p>No invite found.</p>;
  } else if (email === "") {
    return (
      <div>
        <p>Loading...</p>
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
        <input
          type="password"
          name="confirm"
          className="text-black"
          onChange={(event) => {
            setConfirm(event.target.value);
          }}
        />
        <br />
        <p>{errorMessage}</p>
        <br />
        <button onClick={on_submit}>Sign Up</button>
      </div>
    );
  }
}
