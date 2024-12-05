"use client";
import React, { useState } from "react";
import CommonButton from "@/components/common/button/CommonButton"; 

const ResetPasswordForm = () => {
  const [code, setCode] = useState(0); 
  const [password, setPassword] = useState(""); 

  const handleReset = () => {
    console.log(code); 
    console.log(password); 
    return; 
  }

  return (
    <div className="flex flex-col gap-y-4">
      <label className="text-l font-bold">Reset Code</label>
      <input
        type="number"
        id="code" 
        className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text text-black"
        onChange={(e) => setCode(parseInt(e.target.value))}
      />
      <label className="text-l font-bold">New Password</label> 
      <input 
        type="password" 
        id="password" 
        className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text text-black"
        onChange={(e) => setPassword(e.target.value)}
      /> 
      <CommonButton 
        onClick={handleReset} 
        label="Reset Password"
        altTextStyle="text-white" 
        altStyle="bg-dark-blue" 
      /> 
    </div>
  );
};

export default ResetPasswordForm;
