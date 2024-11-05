"use client";
import React from "react";

const ForgotPasswordForm = () => {
  return (
    <div>
      <form className="flex flex-col gap-y-4">
        <label htmlFor="email" className="font-bold text-l">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="flex flex-row justify-between items-center text-sm px-4 py-2 -mt-3 border border-medium-grey-border rounded-lg bg-white cursor-text"
          placeholder="Enter your email"
        />
      </form>

    </div>
  );
};

export default ForgotPasswordForm;
