"use client";
import React, { useState } from "react";
import CommonButton from "@/components/common/button/CommonButton";
import { useSignIn } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";




const LoginForm = () => {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { isLoaded, signIn, setActive } = useSignIn();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }


  const handleChange = () => {
    setChecked((prev) => !prev);
  };


  const handleLogin = async () => {
    if (isLoading) {
      console.log("Is loading:", email);
      return; // Prevent multiple submissions
    }

    try {
      setIsLoading(true);
      
      console.log("El emai:", email);
      console.log("El pass:", password);


      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") { //if(signIn.createdSessionId))
        //await setActive({ session: result.createdSessionId }); //was causing errors
        // Redirect to dashboard or home page after successful sign in
        router.push("/dashboard");
        //window.location.href = "/dashboard";
        console.log("1-Succesfully Logged in ", result.status);
        
      } else {
        // Handle other status cases
        console.log(result);
        setError("Something went wrong. Please try again.");
      }    
      
      // Authenticate the user
      // const signIn = await signInWithPassword({ emailAddress: email, password });

    } catch (err:any) {
      console.error("Error:", err);
      setError(err.errors?.[0]?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
    //console.log("hello");
  };

  //const onEmailChange

  return (
    <>
      <form className="flex flex-col gap-y-4">
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

      <div className="flex flex-row justify-between pt-10 text-sm font-bold">
        <div className="flex gap-1 items-center">
          <input type="checkbox" checked={checked} onChange={handleChange} />
          <label onClick={handleChange} className="cursor-pointer">
            Remember for 7 days
          </label>
        </div>

        <a href="/forgot-password">Forgot password?</a>
      </div>

      <CommonButton
          onClick={handleLogin}
          label="Login"
          altTextStyle="text-white"
          altStyle="bg-dark-blue mt-10 w-full"
      />
       
    </>
  );
};

export default LoginForm;
