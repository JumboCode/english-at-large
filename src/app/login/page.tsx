"use client";
import CommonButton from "@/components/common/button/CommonButton";
import LoginForm from "@/components/login/LoginForm";
import books from "@/images/books.jpg";

import Image from "next/image";

const Login = () => {
  return (
    <div className="flex font-[family-name:var(--font-geist-sans)] left-0 grid grid-cols-5 items-center">
      <div className="col-span-3">
        <Image aria-hidden src={books} alt="books" layout="responsive" />
      </div>

      <div className="container mx-auto px-20 object-fill col-span-2">
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
