"use client";
import React from "react";

const LoginForm = () => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <div>
      <form className="flex flex-col gap-y-4">
        <label htmlFor="email" className="text-l font-bold">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text"
          placeholder="Enter your email"
        />

        <label htmlFor="Password" className="text-l font-bold">
          Password
        </label>
        <input
          type="text"
          id="password"
          className="flex flex-row justify-between items-center -mt-3 text-sm mt-0 px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text"
          placeholder="Enter your password"
        />
      </form>

      <div className="flex flex-row justify-between pt-10 font-bold">
        <div className="flex gap-1">
            <input type="checkbox" checked={checked} onChange={handleChange} />
            <label/> Remember for 7 days <label/> 
        </div>

        <a href="/forgot-password">
          <p> Forgot password? </p>
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
