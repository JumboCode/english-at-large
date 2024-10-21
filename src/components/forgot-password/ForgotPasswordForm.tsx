"use client";
import React from 'react'; 

import CommonButton from '@/components/common/button/CommonButton'; 

const ForgotPasswordForm = () => {
    const handleReset = () => {
        return (<div/>); 
    }
    const toLogin = () => {
        <a href="/login"/> 
    }
  return (
    <div>
      <form className="flex flex-col gap-y-4">
        Forgot password? 
        <p> All good. Enter your account's email and we'll 
            send you a link to reset your password. </p>

        <label htmlFor="email" className="block text-lg">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="border-2 border-black border-solid rounded-md"
        />

        <CommonButton label="Send reset link" onClick={handleReset} /> 

      </form>
      <a href = "/login"> 
        <CommonButton label="Back to login" onClick={toLogin}/>
      </a>
    </div>
  );
};

export default ForgotPasswordForm;
