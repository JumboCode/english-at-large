"use client";
import React, { useEffect, useState } from "react";
import SendInvite from "../../../components/manage/sendInvite";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import { User } from "@prisma/client";
import { getAllUsers } from "@/lib/api/users";
import CommonDropdown from "@/components/common/forms/Dropdown";
import PendingChip from "@/assets/icons/pending_chip";
import { deleteUser } from "@/lib/api/users";

export default function Manage() {
  const [users, setUsers] = useState<User[]>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers ?? []);
    };

    getUsers();
  }, []);

  const getUserDate = (user: User) => {
    const date = new Date(user.createdAt);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    return day + " " + month + " " + year;
  };

  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        Users
      </h1>
      <SearchBar
        button={
          <CommonDropdown items={["All", "Tutors", "Admins", "Pending"]} />
        }
        button2={
          <CommonButton
            label="Invite User"
            onClick={() => {
              setPopupOpen(true);
            }}
            altTextStyle="text-white"
            altStyle="bg-dark-blue"
          />
        }
        placeholderText="Search by name or email"
      />
      <div className="px-16">
        <table className="table-auto bg-white w-full font-family-name:var(--font-geist-sans)]">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/2 text-left text-text-default-secondary">
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
            {users.map((user, index) => (
              <tr key={index} className="bg-white h-16">
                <td className="flex flex-col">
                  <p className="text-black font-semibold">{user.name}</p>
                  <a
                    href={"mailto:" + user.email}
                    className="text-text-default-secondary underline max-w-max"
                  >
                    {user.email}
                  </a>
                </td>
                <td className=" text-black">
                  <div className="flex justify-between min-w-max max-w-[50%]">
                    {user.role}
                  </div>
                </td>
                <td>{user.pending ? <PendingChip /> : null}</td>

                <td className="text-black">{getUserDate(user)}</td>
                <td>
                  <div className="flex justify-end items-center">
                    <CommonButton
                      label="Remove User"
                      onClick={() => {
                        console.log(user.id);
                        deleteUser(user.id);
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
      <SendInvite isOpen={popupOpen} exit={() => setPopupOpen(false)} />
    </div>
  );
}
