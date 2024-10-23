"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
// import { User } from "@prisma/client";
// import { emptyUser } from "@/lib/util/types";
import { useSignUp } from "@clerk/nextjs";
import { SignUpResource } from "@clerk/types";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const { isLoaded, signUp } = useSignUp();
  const [signUpAttempt, setSignUpAttempt] = useState<SignUpResource | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  // console.log("isLoaded:", isLoaded);
  // console.log("signUp:", signUp);

  const inviteToken = useSearchParams().get("__clerk_ticket");

  // useEffect(() => {
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

    // clerkSignup();
  // }, []);

  //User clicks on link to invitation -> Clerk
  //

  const on_submit = async () => {
    if (password != confirm) {
      alert("Passwords do not match!");
    } else {
        console.log(signUpAttempt);  
          // const attempt12 = signUpAttempt;
          try {
            if (signUpAttempt != null && signUp != null){
              const attempt = await signUp.update({ password });
              console.log("status: ", attempt.status);
              console.log("hasPassword: ", attempt.hasPassword);
              console.log("Mi-pass:", password)
            }
            
           
          } catch (error) {
            setErrorMessage("Make sure your password has at least 8 characters, a number, a capital letter, ")
            console.error("Error updating password:", error);
          }

         
        
            
          // console.log("status: ", attempt.status);
          // console.log("status: ", attempt.hasPassword);


        // const attempt = await signUp.update({password: password})
        
        // console.log("status: ", attempt.status);
        // console.log("status: ", attempt.hasPassword)
      
      //call neon (axios) to register user
      console.log("Passwords match. Form submitted");
    }

    // if (signUpAttempt.status === "complete")
    //  get the public metadata
    // let newUser = emptyUser
    // newUser.email = email; etc

    // createUser(newUser)
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
        <button onClick={on_submit}> Sign-up</button>
      </div>
    );
  }
}