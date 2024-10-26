"use client";

import InfoIcon from "@/assets/icons/Info";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";

const SignUp = () => {
  const router = useRouter();
  const handleSignUpClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("./signup/successful-signup");
  };

  const [password, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // check if password & confirm password input match
  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
    setIsFormValid(password.length > 0 && passwordsMatch);
  }, [password, confirmPassword, passwordsMatch]);

  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <form onSubmit={handleSignUpClick} className="group">
            <div className="flex flex-row bg-[#F6FAFD] text-[#757575] p-4 mb-6 rounded-md text-left items-center w-[550px] h-[92px] border-2 border-[#D9D9D9]">
              <InfoIcon className="w-[100px] justify-center" />
              To finish signing up, please create a password to join English At
              Large as a tutor.
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-lg font-[700] font-medium text-gray-900 dark:text-white"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block mb-2 text-lg font-[700] font-medium text-gray-900 dark:text-white"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg fond-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-lg font-[700] font-medium text-gray-900 dark:text-white invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer"
                placeholder="emmalee@gmail.com"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter a valid email address with an @ symbol.
              </span>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-lg font-[700] font-medium text-gray-900 dark:text-white"
              >
                Create Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer"
                placeholder=" "
                required
                onChange={(e) => setNewPassword(e.target.value)}
                pattern="^(?=.*[a-z])(?=.*[A-Z]).{8,}$"
              />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Password must be at least 8 characters long with an uppercase
                and a lowercase letter.
              </span>
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm_password"
                className="block mb-2 text-lg font-[700] font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                className={`bg-gray-50 border ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-500"
                    : "border-gray-300"
                } text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 peer`}
                placeholder=" "
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && !passwordsMatch && (
                <span className="mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                  Passwords do not match.
                </span>
              )}
            </div>
            <button
              type="submit"
              className="flex justify-self-center items-center px-3.5 py-3 min-w-max border rounded-lg border-dark-blue bg-[#202D74] hover:bg-[#202D74]/80 text-white text-base font-bold group-invalid:pointer-events-none group-invalid:opacity-30 disabled:pointer-events-none disabled:opacity-30"
              disabled={!isFormValid}
            >
              Sign up
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SignUp;
