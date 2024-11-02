"use client";
import React, { useState } from "react";

const LoginForm = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <form className="flex flex-col gap-y-4">
        <label className="text-l font-bold">Email</label>
        <input
          type="text"
          id="email"
          className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text"
          placeholder="Enter your email"
        />

        <label className="text-l font-bold">Password</label>
        <input
          type="password"
          id="password"
          className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text"
          placeholder="Enter your password"
        />
      </form>

      <div className="flex flex-row justify-between pt-10 text-sm font-bold">
        <div className="flex gap-1 items-center">
          <input type="checkbox" checked={checked} onChange={handleChange} />
          <label onClick={handleChange} className="cursor-pointer">
            Remember for 7 days
          </label>
        </div>

        <a href="/forgot-password">Forgot password?</a>
      </div>
    </>
  );
};

export default LoginForm;
