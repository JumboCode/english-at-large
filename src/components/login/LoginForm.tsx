"use client";
import React from 'react'; 

const LoginForm = () => {
    const [checked, setChecked] = React.useState(false); 

    const handleChange = () => {
        setChecked(!checked); 
    }; 

  return (
    <div>
      <form className="flex flex-col gap-y-4">
        <h1> Welcome back! </h1>
        <p> Sign in to English at Large Catalog </p>

        <label htmlFor="email" className="block text-lg">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="border-2 border-black border-solid rounded-md"
        />

        <label htmlFor="Password" className="block text-lg">
          Password
        </label>
        <input
          type="text"
          id="password"
          className="border-2 border-black border-solid rounded-md"
        />
      </form>
      <label> 
        <input 
            type="checkbox"
            checked={checked}
            onChange={handleChange}
        /> 
        <p> Remember for 7 days </p>
      </label>

      <a href = "/forgot-password"> 
        <p> Forgot password? </p>
      </a>
    </div>
  );
};

export default LoginForm;
