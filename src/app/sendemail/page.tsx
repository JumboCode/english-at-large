"use client";
import { Suspense } from "react";
// import sgMail from "@sendgrid/mail";
// import { createRequest } from "@/lib/api/requests";
import CreateRequestButton from "../../components/testing/CreateRequestButton"

const sendEmail = () => {

//   const send = async () => {
//     console.log("sent");
//     // createRequest();
//   };

  return (
    <Suspense>
      <CreateRequestButton />
    </Suspense>
  );
};

export default sendEmail;
