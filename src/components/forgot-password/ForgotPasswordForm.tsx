"use client";
import React from "react";

const ForgotPasswordForm = ({
  setEmail,
  error,
}: {
  setEmail: (email: string) => void;
  error: boolean;
}) => {
  return (
    <div>
      <form className="flex flex-col gap-y-4">
        <label htmlFor="email" className="font-bold text-l">
          Email
        </label>
        <input
          type="text"
          id="email"
          className={`flex flex-row justify-between items-center text-sm px-4 py-2 -mt-3 border rounded-lg bg-white cursor-text ${
            error ? "border-red-500" : "border-medium-grey-border"
          }`}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>

    </div>
  );
};

export default ForgotPasswordForm;
