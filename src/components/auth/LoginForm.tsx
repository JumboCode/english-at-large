"use client";
import React, { useState } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import { useSignIn, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const LoginForm = () => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn } = useSignIn();
  const { isSignedIn } = useAuth();

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const handleLogin = async () => {
    if (isSignedIn) {
      console.log("User already signed in, redirecting...");
      window.location.href = "/dashboard";
      return;
    }
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      console.log("Email:", email);

      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        console.log("Login complete, redirecting...");
        // Force a full page refresh to update auth state
        window.location.href = "/dashboard";
      } else {
        console.log(result);
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.errors?.[0]?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="text-l font-bold">Email</label>
        <input
          type="text"
          id="email"
          className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text text-black"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-l font-bold">Password</label>
        <input
          type="password"
          id="password"
          className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text text-black"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <div className="flex flex-row justify-between pt-10 text-sm font-bold">
        <div className="flex gap-1 items-center">
          <input type="checkbox" checked={checked} onChange={handleChange} />
          <label onClick={handleChange} className="cursor-pointer">
            Remember for 7 days
          </label>
        </div>

        <Link href="/forgot-password">Forgot password?</Link>
      </div>
      <CommonButton
        onClick={handleLogin}
        label={isLoading ? "Logging in..." : "Login"}
        altTextStyle="text-white"
        altStyle="bg-dark-blue mt-10 w-full"
        disabled={isLoading}
      />
    </>
  );
};

export default LoginForm;
