"use client";
import { useState, useEffect } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CommonButton from "@/components/common/button/CommonButton";

const ResetPasswordForm = () => {
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    setPasswordsMatch(newPassword === confirmPassword);
    setIsPasswordValid(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(newPassword));
  }, [newPassword, confirmPassword]);

  if (!isLoaded) {
    return null;
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    if (!resetCode || !newPassword || !confirmPassword) {
      setError(true);
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (!passwordsMatch) {
      setError(true);
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        console.log("Password reset successful!");
        setSuccess(true);
        await setActive({ session: result.createdSessionId });
        router.push("/login");
      } else {
        setError(true);
        setErrorMessage("An error occurred. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(true);

      setErrorMessage(
        err.errors?.[0]?.longMessage || "Invalid code or password reset failed."
      );
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <label className="text-l font-bold">Reset Code</label>
      <input
        type="text"
        id="resetCode"
        value={resetCode}
        onChange={(e) => setResetCode(e.target.value)}
        className="flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border border-medium-grey-border rounded-lg bg-white cursor-text text-black"
        required
      />
      <label className="text-l font-bold">New Password</label>
      <input
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={`flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border ${
          error && !isPasswordValid
            ? "border-red-500"
            : "border-medium-grey-border"
        } rounded-lg bg-white cursor-text text-black`}
      />
      {!isPasswordValid && newPassword && (
        <p className="text-red-500 text-sm mt-2">
          Password must be at least 8 characters long and include both uppercase
          and lowercase letters.
        </p>
      )}
      <label className="text-l font-bold">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={`flex flex-row justify-between items-center -mt-3 text-sm px-4 py-2 border ${
          error && !passwordsMatch
            ? "border-red-500"
            : "border-medium-grey-border"
        } rounded-lg bg-white cursor-text text-black`}
      />
      {error && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      {success && (
        <p className="text-green-500 text-sm mt-2">
          Password reset successful!
        </p>
      )}
      <CommonButton
        onClick={handleResetPassword}
        label="Reset Password"
        altTextStyle="text-white"
        altStyle="bg-dark-blue"
      />
    </div>
  );
};

export default ResetPasswordForm;
