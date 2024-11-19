"use client";
import React, { useState } from "react";
import { UserRole } from "@prisma/client";
import { inviteUser, updateUser } from "@/lib/api/users";
import CommonButton from "../common/button/CommonButton";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import DropArrowIcon from "@/assets/icons/DropArrow";
import SmallCheckIcon from "@/assets/icons/SmallCheck";
import XIcon from "@/assets/icons/X";
import { emptyUser } from "@/lib/util/types";
import { createUser } from "@/lib/api/users";
interface SendInviteProps {
  isOpen: boolean;
  exit: () => void;
}

const SendInvite = (props: SendInviteProps) => {
  const { isOpen, exit } = props;
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [status, setStatus] = useState<boolean | null>(null);

  const sendEmail = async () => {
    try {
      if (name && email && role) {
        const newUser = {
          ...emptyUser,
          name: name,
          role: role,
          email: email,
          pending: true,
          inviteID: "",
        };

        const user = await createUser(newUser);
        if (!user) {
          throw "Failed to create user";
        }
        const invitation = await inviteUser(name, email, role, user?.id ?? "");

        const inviteID = invitation.data.invite.id as string;
        // const updatedUser = { ...user, inviteID: inviteID };
        if (user) {
          user.inviteID = inviteID;
          await updateUser(user);
        }
        setStatus(true);
      } else {
        throw "Not all fields completed";
      }
    } catch (error) {
      console.error("Error creating invite: ", error);
      setStatus(false);
    }
  };

  // if (attempt.createdUserId) {
  //   const newUser = {
  //     ...emptyUser,
  //     name: `${formData.firstName} ${formData.lastName}`,
  //     role: (metadata.role as UserRole) || "Tutor",
  //     email: formData.email,
  //     clerkId: attempt.createdUserId,
  //   };
  //   await createUser(newUser);

  return (
    <div>
      {isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white py-6 px-12 rounded-lg shadow-lg min-w-max max-w-large flex flex-col gap-6">
            <div className="flex flex-row justify-between">
              <p className="text-black font-semibold text-2xl font-[family-name:var(--font-rubik)]">
                Invite user
              </p>
              <button className="text-black" onClick={exit}>
                <XIcon />
              </button>
            </div>
            <hr />
            <div>
              <p className="text-black text-lg font-medium font-bold font-[family-name:var(--font-rubik)]">
                Full Name{" "}
              </p>
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
              <p className="text-black text-lg font-medium font-[family-name:var(--font-rubik)]">
                Email{" "}
              </p>
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
              <p className="text-black text-lg font-medium font-[family-name:var(--font-rubik)]">
                Invite as{" "}
              </p>

              <Menu as="div" className="relative inline-block ">
                <div>
                  <MenuButton className="inline-flex w-96 justify-between gap-2 rounded-lg bg-white p-3  border border-medium-grey-border">
                    <p className="text-sm text-medium text-black">
                      {role ?? "Select role"}
                    </p>
                    <DropArrowIcon />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div>
                    <MenuItem>
                      <button
                        onClick={() => setRole(UserRole.Admin)}
                        className="block px-4 py-2 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
                      >
                        <div className="flex justify-between">
                          <p className="text-sm text-black">Admin</p>
                          {role == UserRole.Admin ? (
                            <SmallCheckIcon />
                          ) : (
                            <div />
                          )}
                        </div>
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={() => setRole(UserRole.Tutor)}
                        className="block px-4 py-2 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
                      >
                        <div className="flex justify-between">
                          <p className="text-sm text-black">Tutor</p>
                          {role == UserRole.Tutor ? (
                            <SmallCheckIcon />
                          ) : (
                            <div />
                          )}
                        </div>
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>
            <hr />

            <div className="flex flex-row gap-4">
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
