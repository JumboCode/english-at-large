"use client";

import EyeIcon from "@/assets/icons/Eye";
import InfoIcon from "@/assets/icons/Info";
import { useState, useEffect, useCallback } from "react";
import SuccessfulSignUp from "@/components/SuccessfulSignup";
import { useSignUp, useUser } from "@clerk/nextjs";
import { createUser, getClerkUser } from "@/lib/api/users";
import { emptyUser } from "@/lib/util/types";
import { UserRole } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { sleep } from "@/lib/util/utilFunctions";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const inviteToken = useSearchParams().get("__clerk_ticket");

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [attemptedSignup, setAttemptedSignup] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Initial Clerk signup with invite token
  const clerkSignup = useCallback(async () => {
    if (!inviteToken) {
      router.push("/login");
      return;
    }

    if (!isLoaded || attemptedSignup) return;

    try {
      const attempt = await signUp.create({
        strategy: "ticket",
        ticket: inviteToken,
      });

      setFormData((prev) => ({
        ...prev,
        email: attempt.emailAddress || "",
      }));

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
      }

      setAttemptedSignup(true);
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        router.push("/login");
        return;
      } else {
        console.error("Error during signup:", error);
      }
      setAttemptedSignup(true);
    }
  }, [attemptedSignup, inviteToken, isLoaded, setActive, signUp, router]);

  useEffect(() => {
    if (!attemptedSignup) {
      clerkSignup();
    }
  }, [attemptedSignup, clerkSignup]);

  // Handle form submission and user creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isCreatingUser) return;

    setIsCreatingUser(true);
    try {
      // First, complete Clerk signup
      if (signUp) {
        const attempt = await signUp.update({
          password: formData.password,
        });

        if (attempt.status === "complete") {
          await setActive({ session: attempt.createdSessionId });

          // Wait for user data to be fully loaded
          const waitForMetadata = async () => {
            for (
              let attempts = 0;
              attempt.createdUserId && attempts < 5;
              attempts++
            ) {
              const freshUser = await getClerkUser(attempt.createdUserId);

              if (freshUser?.publicMetadata?.role) {
                return freshUser.publicMetadata;
              }
              sleep(500);
            }
            throw new Error("Metadata not available after waiting");
          };

          const metadata = await waitForMetadata();

          // Now create the user database
          if (attempt.createdUserId) {
            const newUser = {
              ...emptyUser,
              name: `${formData.firstName} ${formData.lastName}`,
              role: (metadata.role as UserRole) || "Tutor",
              email: formData.email,
            };
            console.log(newUser);
            await createUser(newUser);
            setIsSignUpSuccessful(true);
          }
        }
      }
    } catch (error) {
      console.error("Error during signup completion:", error);
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Form validation
  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword);
    setIsFormValid(
      formData.firstName.length > 0 &&
        formData.lastName.length > 0 &&
        formData.password.length > 0 &&
        formData.password === formData.confirmPassword
    );
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // temp handling of 'no data states' to prevent flickering
  if (!inviteToken) {
    return <p>No invite found.</p>;
  } else if (!formData.email) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  } else {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {isSignUpSuccessful ? (
            <SuccessfulSignUp />
          ) : (
            <form onSubmit={handleSubmit} className="group">
              {/* Info box */}
              <div className="flex flex-row bg-[#F6FAFD] text-[#757575] p-4 mb-6 rounded-md text-left items-center w-[550px] h-[92px] border-2 border-[#D9D9D9]">
                <InfoIcon className="w-[100px] justify-center" />
                To finish signing up, please create a password to join English
                At Large as a tutor.
              </div>

              {/* Name fields */}
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-lg font-[700] text-gray-900"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-lg font-[700] text-gray-900"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-lg font-[700] text-gray-900"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled
                />
              </div>

              {/* Password fields */}
              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-lg font-[700] text-gray-900"
                >
                  Create Password
                </label>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white peer"
                  required
                  pattern="^(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                />
                <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                  Password must be at least 8 characters long with an uppercase
                  and a lowercase letter.
                </span>
                <span
                  className="absolute right-3 top-10 cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <EyeIcon
                    className="mt-2"
                    name={isPasswordVisible ? "eye-off" : "eye"}
                  />
                </span>
              </div>

              <div className="mb-6 relative">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-lg font-[700] text-gray-900"
                >
                  Confirm Password
                </label>
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`bg-gray-50 border ${
                    formData.confirmPassword && !passwordsMatch
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  required
                />
                {formData.confirmPassword && !passwordsMatch && (
                  <span className="mt-2 text-sm text-red-500">
                    Passwords do not match.
                  </span>
                )}
                <span
                  className="absolute right-3 top-10 cursor-pointer"
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                >
                  <EyeIcon
                    className="mt-2"
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  />
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="flex justify-self-center items-center px-3.5 py-3 min-w-max border rounded-lg border-dark-blue bg-[#202D74] hover:bg-[#202D74]/80 text-white text-base font-bold group-invalid:pointer-events-none group-invalid:opacity-30 disabled:pointer-events-none disabled:opacity-30"
                disabled={!isFormValid || isCreatingUser}
              >
                {isCreatingUser ? "Creating account..." : "Sign up"}
              </button>
            </form>
          )}
        </main>
      </div>
    );
  }
};

export default SignUp;
