"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@prisma/client";
import { emptyUser } from "@/lib/util/types";
import { useSignUp } from "@clerk/nextjs";
import { SignUpResource } from "@clerk/types";
import {createUser} from '../../lib/api/users'
import { useUser } from "@clerk/nextjs";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [signUpAttempt, setSignUpAttempt] = useState<SignUpResource | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const { user } = useUser()


  useEffect(() => {
    if (user !== null && user !== undefined) {
      const metadata = user.publicMetadata ?? {}

      const newUser = { ...emptyUser }
      newUser.name = (metadata["name"] ? String(metadata["name"]) : "")

      const role = metadata["role"]
      console.log("THEROLE:", role)
      if (role === "Admin") {
        newUser.role = UserRole.Admin;
      } else if (role === "Tutor") {
        newUser.role = UserRole.Tutor;
      } else {
        newUser.role = UserRole.Volunteer;
      }

      newUser.email =  user.primaryEmailAddress?.emailAddress ?? ""

      // console.log("Name: ", newUser.name)
      // console.log("Role: ", newUser.role)
      // console.log("Email: ", newUser.email)

      createUser(newUser)
    } else {
      console.error("no active user")
    }
  }, [user])


  const inviteToken = useSearchParams().get("__clerk_ticket");

  const clerkSignup = async () => {
    if (isLoaded) {
      console.log("signing up");
      const attempt = await (signUp as SignUpResource).create({
        strategy: "ticket",
        ticket: inviteToken || "",
      });

      
      console.log(attempt);
      console.log("status: ", attempt.status);
      setEmail(attempt.emailAddress || "");
      setSignUpAttempt(attempt);

    }
  };


  const on_submit = async () => {
    if (password != confirm) {
      alert("Passwords do not match!");
    } else {
      const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

      if (passwordRegex.test(password)) {
        try {
          if (signUpAttempt != null && signUp != null){
            const attempt = await signUp.update({ password });
            // console.log("status: ", attempt.status);
            // console.log("hasPassword: ", attempt.hasPassword);
            // console.log("Mi-pass:", password)

            if (attempt.status === "complete"){
                await setActive({ session: attempt.createdSessionId })
            }
          }
          
          setErrorMessage("");
        } catch (error) {
          console.error("Error updating password:", error);
          setErrorMessage("error setting clerk password")
        }
      } else {
        setErrorMessage("Make sure your password has at least 8 characters, including a number, a lowercase, a capital, and a special character.");
      }
        
    }
  };

  if (!inviteToken) {
    return <p>no invite found</p>;
  } else if (email == "") {
    return <div><p>loading</p>
            <button onClick={clerkSignup}> Clerk Sign-up</button>
            </div>;
  } else {
    return (
      <div>
        <p>Email: </p>
        <p>{email}</p>
        <p>Password: </p>
        <input
          type="text"
          name="email"
          className="text-black"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <p>Password: </p>
        <input
          type="text"
          name="email"
          className="text-black"
          onChange={(event) => {
            setConfirm(event.target.value);
          }}
        />
        <br></br>
        <p>{errorMessage}</p>
        <br></br>
        <button onClick={on_submit}> Sign-up</button>
      </div>
    );
  }
}