"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { User } from "@prisma/client";
import { emptyUser } from "@/lib/util/types";


export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");


  
  const inviteToken = useSearchParams().get('__clerk_ticket')
  useEffect(() => {
    console.log("HELLLOOOOOOOOO")
    console.log("my invite token: " + inviteToken)
  })

  //User clicks on link to invitation -> Clerk 
  //

  const on_submit = () => {
    
    if (password != confirm) {
        
        alert("Passwords do not match!");
    } else {
        console.log("Passwords match. Form submitted")
    }
    
    // const signUpAttempt = await signUp.create({
    //     strategy: 'ticket',
    //     ticket: inviteToken,
    //     firstName,  do we actually need these?
    //     lastName, dont know this
    //     password,
    //   })

    // if (signUpAttempt.status === "complete")
        //  get the public metadata
        // let newUser = emptyUser
        // newUser.email = email; etc

        // createUser(newUser)
  };

  if (!inviteToken) {
    return (<p>no invite found</p>)
  }
  return (
    <div>
      <p>Email: </p>
      <input
        type="text"
        name="Email"
        className="text-black"
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
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
      <button onClick = {on_submit}> Sign-up</button>
    </div>
  );
}



// export const User: Omit<User, "id" | "createdAt" | "updatedAt"> = {
//     name: "Bob",
//     email: "bob@gmail.com",
//     role: "Admin",
//   };



/*

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?  @unique
  role      UserRole
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relation to Request
  requests Request[] // One user can have many requests

  @@map("users")
}
*/
