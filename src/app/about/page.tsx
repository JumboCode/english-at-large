import CreateBookButton from "@/components/about/CreateBookButton";
import UpdateBookButton from "@/components/about/UpdateBookButton";
import DeleteBookButton from "@/components/about/DeleteBookButton";
import GetOneBookButton from "@/components/about/GetOneBookButton";
import React from "react";
import GetAllBookButton from "@/components/about/GetAllBookButton";

export default function About() {
  return (
    <div>
      Testing
      <CreateBookButton />
      <UpdateBookButton />
      <DeleteBookButton />
      <GetOneBookButton />
      <GetAllBookButton />
    </div>
  );
}
