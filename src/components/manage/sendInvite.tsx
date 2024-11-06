"use client";
import React, { useState } from "react";
import { UserRole } from "@prisma/client";
import { inviteUser } from "@/lib/api/users";

interface SendInviteProps {
  isOpen: boolean;
  exit: () => void;
}

const SendInvite = (props: SendInviteProps) => {
  const { isOpen, exit } = props;
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

  if (!isOpen) {
    return <div />;
  } else {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white py-6 px-12 rounded-lg shadow-lg max-w-2/3">
          <div className="flex flex-row justify-between">
            <p className="text-black">Invite user</p>
            <button className="text-black" onClick={exit}>
              X
            </button>
          </div>
          <hr />
          <p className="text-black">Full Name: </p>
          <input
            type="text"
            name="fullname"
            className="text-black"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <p className="text-black">Email: </p>
          <input
            type="text"
            name="email"
            className="text-black"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <p className="text-black">Invite as </p>

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
      </div>
    );
  }
};

export default SendInvite;
