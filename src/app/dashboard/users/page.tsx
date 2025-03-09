"use client";
import React, { useEffect, useState } from "react";
import SendInvite from "../../../components/manage/sendInvite";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import { User, UserRole } from "@prisma/client";
import { getAllUsers } from "@/lib/api/users";
import CommonDropdown from "@/components/common/forms/Dropdown";
import PendingChip from "@/assets/icons/pending_chip";
import { deleteUser } from "@/lib/api/users";
import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { redirect } from "next/navigation";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import XIcon from "@/assets/icons/X";
import {
  ConfirmPopupActions,
  ConfirmPopupTypes,
} from "@/lib/context/ConfirmPopupContext";

export default function Manage() {
  const user = useCurrentUser();

  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    if (user?.role !== "Admin" && user?.role != undefined) {
      redirect("/dashboard");
    }
  }, [user]);

  const [users, setUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState<string>("");
  const [invitePopupOpen, setInvitePopupOpen] = useState<boolean>(false);
  const [removePopupOpen, setRemovePopupOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { setConfirmPopup, hidePopup, popupStatus } = usePopup();

  // use of structured clone creates new subset of search target users
  // allows filter to act on subset of searched users
  const subsetUsers = structuredClone<User[]>(users).filter(
    (user) =>
      user.name?.toLowerCase().includes(searchData) ||
      user.email?.toLowerCase().includes(searchData)
  );

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers ?? []);
    };
    getUsers();
    console.log(filter);
  }, [filter]);

  const roleFilter = (user: User) => {
    switch (filter) {
      case "Admins":
        return user.role === UserRole.Admin;
      case "Tutors":
        return user.role === UserRole.Tutor;
      case "Pending":
        return user.pending === true;
      default:
        return true;
    }
  };

  const removeUser = async (user: User | null) => {
    if (!user) return; // Ensure user is not null
    try {
      await deleteUser(user.id); // Delete the user
      setRemovePopupOpen(false); // Close the confirmation modal
      setConfirmPopup({
        type: ConfirmPopupTypes.USER,
        action: ConfirmPopupActions.REMOVE,
        success: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setConfirmPopup({
        type: ConfirmPopupTypes.USER,
        action: ConfirmPopupActions.REMOVE,
        success: false,
      });
    }
  };

  return (
    <div>
      {user?.role === "Admin" ? (
        <div className="bg-white">
          <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
            Users
          </h1>
          <SearchBar
            button={
              <CommonDropdown
                items={["All", "Tutors", "Admins", "Pending"]}
                altButtonStyle="min-w-28"
                buttonText={"Sort by"}
                setFilter={setFilter}
              />
            }
            button2={
              <CommonButton
                label="Invite User"
                onClick={() => {
                  setInvitePopupOpen(true);
                }}
                altTextStyle="text-white"
                altStyle="bg-dark-blue"
              />
            }
            placeholderText="Search by name or email"
            setSearchData={setSearchData}
          />
          <div className="px-16">
            <table className="table-auto bg-white w-full font-family-name:var(--font-geist-sans)]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 w-1/2 text-left text-text-default-secondary">
                    Name
                  </th>
                  <th className="w-[4.166666%] text-left text-text-default-secondary">
                    Role
                  </th>
                  <th className="w-[12.499999%] text-left"> </th>
                  <th className="w-1/6 text-left text-text-default-secondary">
                    Date Invited
                  </th>
                  <th className="w-1/6" />
                </tr>
              </thead>
              <tbody className="divide-y divide-solid">
                {subsetUsers.filter(roleFilter).map((user, index) => (
                  <tr key={index} className="bg-white h-16">
                    <td className="flex flex-col">
                      <p className="text-black font-semibold">{user.name}</p>
                      <Link
                        href={"mailto:" + user.email}
                        className="text-text-default-secondary underline max-w-max"
                      >
                        {user.email}
                      </Link>
                    </td>
                    <td className=" text-black">
                      <div className="flex justify-between min-w-max max-w-[50%]">
                        {user.role}
                      </div>
                    </td>
                    <td>{user.pending ? <PendingChip /> : null}</td>

                    <td className="text-black">
                      {dateToTimeString(user.createdAt)}
                    </td>
                    <td>
                      <div className="flex justify-end items-center">
                        <CommonButton
                          label="Remove User"
                          onClick={() => {
                            setSelectedUser(user);
                            setRemovePopupOpen(true);
                          }}
                          altTextStyle="text-dark-blue"
                          altStyle="bg-white"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SendInvite
            isOpen={invitePopupOpen}
            exit={() => setInvitePopupOpen(false)}
          />
          {removePopupOpen && selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white py-6 px-12 rounded-lg shadow-lg min-w-max max-w-large flex flex-col gap-6">
                <div className="flex flex-row justify-between">
                  <p className="text-black font-semibold text-2xl font-[family-name:var(--font-rubik)]">
                    Remove User
                  </p>
                  <button
                    className="text-black"
                    onClick={() => setRemovePopupOpen(false)}
                  >
                    <XIcon />
                  </button>
                </div>
                <hr />
                <p className="text-black text-lg font-medium">
                  Are you sure you want to remove {selectedUser.name}?
                </p>
                <div className="flex flex-row gap-4">
                  <CommonButton
                    label="Cancel"
                    onClick={() => setRemovePopupOpen(false)}
                    altStyle="w-1/2"
                  />
                  <CommonButton
                    label="Remove"
                    onClick={async () => {
                      removeUser(selectedUser);
                    }}
                    altTextStyle="text-white"
                    altStyle="bg-red-600 w-1/2 border-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {popupStatus.shown ? (
        <ConfirmationPopup
          type={popupStatus.type}
          action={popupStatus.action}
          success={popupStatus.success}
          onDisappear={() => hidePopup()}
          custom={popupStatus.custom}
        />
      ) : null}
    </div>
  );
}
