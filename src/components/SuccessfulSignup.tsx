"use client";

import CheckIcon from "@/assets/icons/Check";
import CommonButton from "@/components/common/button/CommonButton";
import { useRouter } from "next/navigation";

const SuccessfulSignUp = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/dashboard/books');
  };
  return (
    <div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col gap-8 row-start-2 items-center align-center justify-center sm:items-start">
          <CheckIcon className="place-self-center" />

          <p className="text-2xl font-bold text-gray-900 items-center place-self-center">
            Congratulations, you&apos;re a tutor!
          </p>

          <p className="font-[757575] place-self-center">
            Log in to access the book and online resource catalog.
          </p>

          <CommonButton
            label="Continue"
            onClick={handleClick}
            altStyle="border-dark-blue bg-[#202D74] hover:bg-[#202D74]/80 place-self-center"
            altTextStyle="text-white font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessfulSignUp;
