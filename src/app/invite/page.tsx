import React, { Suspense } from "react";
import SignUp from "../../components/invite/sign_up";

export default function Manage() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
