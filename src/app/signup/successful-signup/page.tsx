"use client";

import CheckIcon from "@/assets/icons/Check";
import CommonButton from "@/components/common/button/CommonButton";
import { useRouter } from "next/navigation";

const SuccessfulSignUp = () => {
  const router = useRouter();
  const handleClick = (event: Event) => {
    event.preventDefault();
    router.push("/");
  };
  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center align-center justify-center sm:items-start">
          <CheckIcon className="place-self-center" />

          <p className="text-2xl font-bold text-gray-900 items-center place-self-center">
            Congratulations, you are a tutor!
          </p>

          <p className="font-[757575] place-self-center">
            Log in to access the book and online resource catalog.
          </p>

          <CommonButton
            label="Go to login"
            onClick={() => handleClick}
            altStyle="border-dark-blue bg-[#202D74] hover:bg-[#202D74]/80 place-self-center"
            altTextStyle="text-white font-bold"
          />
        </main>
      </div>
    </div>
  );
};

export default SuccessfulSignUp;
