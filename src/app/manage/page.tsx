"use client";
import React from "react";
import SendInvite from "../../components/manage/sendInvite";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import DropArrowIcon from "@/assets/icons/DropArrow";

export default function Manage() {
  return (
    <div>
      <SearchBar
        button={
          <CommonButton
            label="All"
            onClick={() => {}}
            rightIcon={<DropArrowIcon />}
            altTextStyle="text-dark-blue"
            altStyle="bg-white"
          />
        }
        button2={
          <CommonButton
            label="Invite User"
            onClick={() => {}}
            altTextStyle="text-white"
            altStyle="bg-dark-blue"
          />
        }
        placeholderText="Search by name or email"
      />
      <SendInvite />
    </div>
  );
}
