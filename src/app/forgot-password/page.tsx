"use client";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm";
import books from "@/images/books.jpg";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { getAllUsers } from "@/lib/api/users";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoaded, signIn } = useSignIn();

  const router = useRouter();
  if (!isLoaded) {
    return null;
  }

  const checkUserEmail = async (email: string) => {
    const users = await getAllUsers();
    return users ? !users.some((user) => user.email === email) : false;
  };

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setError(false);

    if (!email) {
      setError(true);
      setErrorMessage("Please enter an email.");
      return;
    }

    const invalidEmail = await checkUserEmail(email);

    if (invalidEmail) {
      setError(true);
      setErrorMessage("Email not found. Please try again.");
      return;
    }

    if (!signIn) {
      setError(true);
      setErrorMessage(
        "Sign-in functionality is not initialized. Please try again later."
      );
      return;
    }

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      router.push("/reset-password");
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage(
        err.errors?.[0]?.longMessage || "Failed to send reset email."
      );
    }
  }

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
          <h1>Forgot password?</h1>
        </div>

        <div className="text-m pb-10 text-zinc-500">
          <p>
            {" "}
            All good. Enter your account&apos;s email and we&apos;ll send you a
            link to reset your password.{" "}
          </p>
        </div>
        <ForgotPasswordForm setEmail={setEmail} error={error} />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

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

export default ForgotPassword;
