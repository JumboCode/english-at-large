"use client";
import React, { useEffect, useState } from "react";
import SendInvite from "../../../components/manage/sendInvite";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import DropArrowIcon from "@/assets/icons/DropArrow";
import { User } from "@prisma/client";
import { getAllUsers } from "@/lib/api/users";
import Dropdown from "@/components/common/forms/Dropdown";

export default function Manage() {
  const [users, setUsers] = useState<User[]>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };

    getUsers();
  }, []);
  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 font-bold text-4xl font-geist-sans">
        Users
      </h1>
      <SearchBar
        button={
          <Dropdown />
          // <CommonButton
          //   label="All"
          //   onClick={() => {}}
          //   rightIcon={<DropArrowIcon />}
          //   altTextStyle="text-dark-blue"
          //   altStyle="bg-white"
          // />
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
              <th className="w-1/6 text-left text-text-default-secondary">
                Role
              </th>
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
                <td className="text-black">{user.role}</td>
                <td className="text-black">{"6 November 2024"}</td>
                <td>
                  <div className="flex justify-end items-center">
                    <CommonButton
                      label="Remove User"
                      onClick={() => {}}
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
