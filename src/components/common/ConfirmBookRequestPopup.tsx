import checkmark from "../../assets/icons/checkmark.svg";
import xmark from "../../assets/icons/xmark.svg";
import Image from "next/image";
import Link from "next/link";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

interface ConfirmBookRequestProps {
  toggle: () => void;
  success: boolean;
  errorMsg: string;
}

const ConfirmBookRequestPopup = (props: ConfirmBookRequestProps) => {
  const { toggle, success, errorMsg } = props;
  const exit = () => {
    toggle();
  };
  const imageStyle = {
    minHeight: "50px",
    minWidth: "50px",
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-5/12">
          <div className="flex justify-end items-center h-full">
            <button onClick={exit} className="bg-white text-gray-600 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-end items-center h-full"></div>
          <div className="flex justify-center m-6">
            <Image
              src={success ? checkmark : xmark}
              alt="navy check mark"
              width={50}
              height={80}
              style={imageStyle}
            />
          </div>
          <div className="flex justify-center font-[family-name:var(--font-rubik)] font-semibold text-2xl m-2">
            {success ? "You have borrowed the book!" : "Unable to borrow book"}
          </div>
          <div className="flex justify-center text-[#757575] font-[family-name:var(--font-rubik)] text-xs mb-10">
            {success
              ? "Please arrange a time with the EAL office to schedule your book pick-up."
              : errorMsg}
          </div>
          <div className="flex row-span-2 mt-5 gap-3 justify-between">
            <a
              href="/dashboard"
              className="flex flex-row items-center w-56 h-10 text-[#202D74] justify-center gap-2 p-3 min-w-max border rounded-lg border-dark-blue font-[family-name:var(--font-rubik)] font-semibold bg-white text-sm"
            >
              Keep Browsing
            </a>
            <Link
              href={"/dashboard/shelf/" + useCurrentUser()?.id}
              className="flex flex-row items-center w-56 h-10 text-white justify-center gap-2 p-3 min-w-max border rounded-lg border-dark-blue font-[family-name:var(--font-rubik)] font-semibold bg-[#202D74] text-sm"
            >
              Go to Shelf
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookRequestPopup;
