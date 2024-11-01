"use client";
import React, { useState } from "react";
import { UserRole } from "@prisma/client";
import { inviteUser } from "@/lib/api/users";

export default function SendInvite() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.Tutor);
  const [statusText, setStatusText] = useState("");

  const handleUserKind = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value as UserRole);
  };

  const sendEmail = async () => {
    try {
      await inviteUser(name, email, role);
      setStatusText("Invite sent!");
    } catch (error) {
      console.error("Error creating invite: ", error);
      setStatusText("Invite failed, please try again!");
    }
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
        value={UserRole.Tutor}
        onChange={handleUserKind}
      />
      <label htmlFor="tutor">Tutor</label>
      <br />
      <input
        type="radio"
        id="admin"
        name="usertype"
        value={UserRole.Admin}
        onChange={handleUserKind}
      />
      <label htmlFor="admin">Admin</label>
      <br />
      <button>Cancel</button>
      <br />
      <button onClick={sendEmail}>Send Invite</button>
      <p>{statusText}</p>
    </div>
  );
}
