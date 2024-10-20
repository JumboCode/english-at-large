import CreateBookButton from "@/components/about/CreateBookButton";
import CreateRequestButton from "@/components/about/CreateRequestButton";
import GetRequestButton from "@/components/about/GetRequestButton";
import UpdateRequestButton from "@/components/about/UpdateRequestButton";
import DeleteRequestButton from "@/components/about/DeleteRequestButton";

import React from "react";

export default function About() {
  return (
    <div>
      Testing
      <CreateBookButton />
      <CreateRequestButton />
      <GetRequestButton />
      <UpdateRequestButton />
      <DeleteRequestButton />
    </div>
  );
}
