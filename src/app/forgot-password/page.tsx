"use client";
import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm";
import books from "@/images/books.jpg";
import CommonButton from "@/components/common/button/CommonButton";
import Image from "next/image";

const ForgotPassword = () => {
  const handleReset = () => {
    return <div />;
  };
  const toLogin = () => {
    <a href="/login" />;
  };

  return (
    <div className="font-family-name:var(--font-geist-sans)] grid grid-cols-5 items-center">
      <div className="col-span-3">
        <Image aria-hidden src={books} alt="books" layout="responsive" />
      </div>

      <div className="container mx-auto px-20 object-fill col-span-2">
        <div className="text-2xl font-bold flex flex-col-3">
          <h1>Forgot password?</h1>
        </div>

        <div className="text-m pb-10 text-zinc-500">
          <p>
            {" "}
            All good. Enter your account's email and we'll send <br /> you a
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

          <a href="/login">
            <CommonButton
              label="Back to login"
              onClick={toLogin}
              altTextStyle="text-dark-blue"
              altStyle="bg-white outline-dark-blue mt-3 w-full"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
