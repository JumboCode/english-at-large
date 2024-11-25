"use client";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm";
import books from "@/images/books.jpg";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { getAllUsers } from "@/lib/api/users";


const ResetPassword = () => {
  const [email, setEmail] = useState(''); 
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkUserEmail = async (email: string) => {
    const users = await getAllUsers();
    return users ? !users.some((user) => user.email === email) : false;
  };

  const handleReset = async () => {
    setErrorMessage('');
    setError(false);

    if (!email) {
      setError(true);
      setErrorMessage("Please enter an email.");
      return;
    }

    console.log("email: ", email);

    const invalidEmail = await checkUserEmail(email);

    if (invalidEmail) {
      console.log("unsucessful!");
      setError(true);
      setErrorMessage("Please enter a valid email address.");
    } else {
      setError(false);
      console.log("success!");
    }

    return;
  };

  

  return (
    <div className="font-family-name:var(--font-geist-sans)] grid grid-cols-7 items-center">
      <div className="hidden md:block container relative h-full min-h-screen col-span-4">
        <Image
          aria-hidden
          src={books}
          alt="books"
          layout="fill"
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-20 object-fill col-span-7 md:col-span-3 mt-5 ">
        <div className="text-2xl font-bold flex flex-col-3">
          <h1>Reset link sent!</h1>
        </div>

        <div className="text-m pb-10 text-zinc-500">
          <p>
            {" "}
            Please enter the code sent to your email. 
            {" "}
          </p>
        </div>
        <ResetasswordForm setEmail={setEmail} error={error}/>
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        <div>
          <CommonButton
            label="Send reset link"
            onClick={handleReset}
            altTextStyle="text-white"
            altStyle="bg-dark-blue mt-10 w-full"
          />
          <Link href="/login">
            <CommonButton
              label="Back to login"
              altTextStyle="text-dark-blue"
              altStyle="bg-white outline-dark-blue mt-3 w-full"
            />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
