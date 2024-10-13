import React from "react";

import CreateBookButton from "@/components/about/CreateBookButton";
import CreateUserButton from "@/components/about/CreateUserButton";
import GetAllUsersButton from "@/components/about/GetAllUsersButton";
import GetUsersButton from "@/components/about/GetUserButton";
import UpdateUserButton from "@/components/about/UpdateUserButton";
import DeleteUserButton from "@/components/about/DeleteUserButton";


export default function About() {
  return (
    <div>
      Testing
      <CreateBookButton />
      <CreateUserButton />
      <GetAllUsersButton />
      <GetUsersButton />
      <UpdateUserButton />
      <DeleteUserButton />
    </div>
  );
}
