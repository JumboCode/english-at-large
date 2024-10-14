import CreateBookButton from "@/components/about/CreateBookButton";
import UpdateBookButton from "@/components/about/UpdateBookButton";
import DeleteBookButton from "@/components/about/DeleteBookButton";
import GetOneBookButton from "@/components/about/GetOneBookButton";
import React from "react";

export default function About() {
  return (
    <div>
      Testing
      <CreateBookButton />
      <UpdateBookButton />
      <DeleteBookButton />
      <GetOneBookButton />
    </div>
  );
}
