"use client";
import React, { useState } from "react";

const ResetPasswordForm = ({
  setEmail,
  error,
}: {
  setEmail: (email: string) => void;
  error: boolean;
}) => {
  const [code, setCode] = useState(0); 
  return (
    <div>
      <label className="text-l font-bold">Code</label>
        <input
          type="text"
          id="email"
          className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text text-black"
          // placeholder="Enter your email"
          onChange={(e) => setCode(e.target.value)}
        />

    </div>
  );
};

export default ResetPasswordForm;
