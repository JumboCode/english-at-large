import React from "react";

import CreateUserButton from "@/components/testing/CreateUserButton";
import GetAllUsersButton from "@/components/testing/GetAllUsersButton";
import GetUsersButton from "@/components/testing/GetUserButton";
import UpdateUserButton from "@/components/testing/UpdateUserButton";
import DeleteUserButton from "@/components/testing/DeleteUserButton";
import CreateBookButton from "@/components/testing/CreateBookButton";
import DeleteBookButton from "@/components/testing/DeleteBookButton";
import GetAllBookButton from "@/components/testing/GetAllBookButton";
import GetOneBookButton from "@/components/testing/GetOneBookButton";
import UpdateBookButton from "@/components/testing/UpdateBookButton";
import CreateRequestButton from "@/components/testing/CreateRequestButton";
import DeleteRequestButton from "@/components/testing/DeleteRequestButton";
import GetRequestButton from "@/components/testing/GetRequestButton";
import UpdateRequestButton from "@/components/testing/UpdateRequestButton";
import GetOneRequestButton from "@/components/testing/GetOneRequestButton";

const About = () => {
  return (
    <div>
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

      <div className="flex flex-col">
        <div className="text-lg">Book CRUD</div>
        <div className="flex row-span-3 gap-4">
          <CreateBookButton />
          <GetAllBookButton />
          <GetOneBookButton />
          <UpdateBookButton />
          <DeleteBookButton />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-lg">Request CRUD</div>
        <div className="flex row-span-3 gap-4">
          <CreateRequestButton />
          <GetRequestButton />
          <GetOneRequestButton />
          <UpdateRequestButton />
          <DeleteRequestButton />
        </div>
      </div>
    </div>
  );
};

export default About;
