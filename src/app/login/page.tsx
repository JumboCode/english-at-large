"use client";
import CommonButton from "@/components/common/button/CommonButton";
import LoginForm from "@/components/login/LoginForm";
import books from "@/images/books.jpg";

import Image from "next/image";

const Login = () => {
  return (
      <div className="font-[family-name:var(--font-geist-sans)] left-0 grid grid-cols-7 items-center">
        <div className="hidden sm:block container object-cover h-full min-h-screen col-span-4">
          <Image
            aria-hidden
            src={books}
            alt="books"
            layout="responsive"
            style={{ maxHeight: '100vh' }}
          />
        </div>

        <div className="container mx-auto px-20 object-fill col-span-7 sm:col-span-3 mt-5">
          <div className="text-2xl font-bold">
            <h1> Welcome back! </h1>
          </div>

          <div className="text-m pb-10 text-zinc-500">
            <p> Sign in to English at Large Catalog </p>
          </div>

          <LoginForm />

          <CommonButton
            onClick={() => {}}
            label="Login"
            altTextStyle="text-white"
            altStyle="bg-dark-blue mt-10 w-full"
          />
        </div>
      </div>
  );
};

export default Login;
