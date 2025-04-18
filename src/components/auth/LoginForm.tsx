"use client";
import React, { useEffect, useState } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import { useSignIn, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // auto sign in if logged in
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const result = await signIn?.create({
        identifier: email,
        password: password,
      });

      if (result?.status === "complete") {
        // Force full refresh with vanilla JS; router.refresh() only does server side refreshes
        window.location.href = "/dashboard";
      } else {
        setError("Something went wrong. Please try again.");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err.errors?.[0]?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <label className="text-l font-bold">Email</label>
        <input
          type="email"
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
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex flex-row justify-between pt-5 text-sm font-bold">
        <Link href="/forgot-password">Forgot password?</Link>
      </div>

      <CommonButton
        onClick={handleLogin}
        label={isLoading ? "Logging in..." : "Login"}
        altTextStyle="text-white"
        altStyle="bg-dark-blue mt-5 w-full"
        disabled={isLoading}
        type="submit"
      />
    </>
  );
};

export default LoginForm;
