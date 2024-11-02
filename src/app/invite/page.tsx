import React, { Suspense } from "react";
import SignUp from "../../components/invite/signUp";

export default function Manage() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
