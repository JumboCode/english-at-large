"use client";
import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm";
import books from "@/images/books.jpg";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
  const handleReset = () => {
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
          <h1>Forgot password?</h1>
        </div>

        <div className="text-m pb-10 text-zinc-500">
          <p>
            {" "}
            All good. Enter your account&apos;s email and we&apos;ll send you a
            link to reset your password.{" "}
          </p>
        </div>
        <ForgotPasswordForm />

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
