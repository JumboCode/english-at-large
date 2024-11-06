"use client";
import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

const SignUp = () => {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
};

export default SignUp;
