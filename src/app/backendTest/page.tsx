import React from "react";

import CreateUserButton from "@/components/about/CreateUserButton";
import GetAllUsersButton from "@/components/about/GetAllUsersButton";
import GetUsersButton from "@/components/about/GetUserButton";
import UpdateUserButton from "@/components/about/UpdateUserButton";
import DeleteUserButton from "@/components/about/DeleteUserButton";

const About = () => {
  return (
    <div className="flex flex-col">
      <div className="text-lg">User CRUD</div>
      <div className="flex row-span-3 gap-4">
        <CreateUserButton />
        <GetAllUsersButton />
        <GetUsersButton />
        <UpdateUserButton />
        <DeleteUserButton />
      </div>
    </div>
  );
};

export default About;
