"use client";
import React, { useState } from "react";
import clerkClient from "@/clerk";
import { createUser } from "@/lib/api/users";
import { newEmptyUser } from "@/lib/util/types";

function SendInvite() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userKind, setUserKind] = useState<string>("");

  const handleUserKind = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserKind(event.target.value);
  };

  const sendEmail = () => {
    console.log("submitted the form!");
    console.log(name);
    console.log(email);
    console.log(userKind);

    // clerkClient.invitations.createInvitation({
    //   emailAddress: email,
    //   redirectUrl: "http://localhost:3000/",
    // });
    createUser(newEmptyUser);
  };

  return (
    <div>
      <p>Full Name: </p>
      <input
        type="text"
        name="fullname"
        className="text-black"
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <p>Email: </p>
      <input
        type="text"
        name="email"
        className="text-black"
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <p>Invite as </p>

      <input
        type="radio"
        id="tutor"
        name="usertype"
        value="Tutor"
        onChange={handleUserKind}
      />
      <label htmlFor="tutor">Tutor</label>
      <br />
      <input
        type="radio"
        id="admin"
        name="usertype"
        value="Admin"
        onChange={handleUserKind}
      />
      <label htmlFor="admin">Admin</label>
      <br />
      <button>Cancel</button>
      <br />
      <button onClick={sendEmail}>Send Invite</button>
    </div>
  );
}

// const response = await clerkClient.invitations.createInvitation({
//     emailAddress: 'invite@example.com',
//     redirectUrl: 'https://www.example.com/my-sign-up',
//     publicMetadata: {
//       example: 'metadata',
//       example_nested: {
//         nested: 'metadata',
//       },
//     },
//   })

//console.log(response)
/*
  _Invitation {
    id: 'inv_123',
    emailAddress: 'invite@example.com',
    publicMetadata: { example: 'metadata', example_nested: [Object] },
    createdAt: 1705531674576,
    updatedAt: 1705531674576,
    status: 'pending',
    revoked: undefined
  }
  */

export default SendInvite;
