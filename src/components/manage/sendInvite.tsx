"use client";
import React, { useState } from "react";
import { UserRole } from "@prisma/client";
import { inviteUser } from "@/lib/api/users";
import CommonButton from "../common/button/CommonButton";

interface SendInviteProps {
  isOpen: boolean;
  exit: () => void;
}

const SendInvite = (props: SendInviteProps) => {
  const { isOpen, exit } = props;
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.Tutor);
  const [status, setStatus] = useState<boolean | null>(null);
  const handleUserKind = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value as UserRole);
  };

  const sendEmail = async () => {
    try {
      await inviteUser(name, email, role);
      setStatus(true);
    } catch (error) {
      console.error("Error creating invite: ", error);
      setStatus(false);
    }
  };

  return (
    <div>
      {isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white py-6 px-12 rounded-lg shadow-lg min-w-max max-w-large flex flex-col gap-6">
            <div className="flex flex-row justify-between">
              <p className="text-black text-semibold text-2xl">Invite user</p>
              <button className="text-black" onClick={exit}>
                X
              </button>
            </div>
            <hr />
            <div>
              <p className="text-black text-lg font-medium">Full Name </p>
              <input
                type="text"
                name="fullname"
                className="text-black border border-medium-grey-border p-2 rounded-lg w-96"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            <div>
              <p className="text-black text-lg font-medium">Email </p>
              <input
                type="text"
                name="email"
                className="text-black border border-medium-grey-border p-2 rounded-lg  w-96"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>

            <div>
              <p className="text-black text-lg font-medium">Invite as </p>
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
            </div>
            <hr />

            <div className="flex flex-row gap-2">
              <CommonButton label="Cancel" onClick={exit} altStyle="w-1/2" />
              <CommonButton
                label="Send Invite"
                onClick={() => {
                  exit();
                  sendEmail();
                }}
                altTextStyle="text-white"
                altStyle="bg-dark-blue w-1/2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div />
      )}
      {/* This is a placeholder for the invite toast */}
      <p>{String(status)}</p>
    </div>
  );
};

export default SendInvite;
