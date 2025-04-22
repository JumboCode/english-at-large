import React from "react";
import { RequestStatus } from "@prisma/client";

interface LoanStatusTagProps {
  status: RequestStatus;
}

const LoanStatusTag = ({ status }: LoanStatusTagProps) => {
  const baseStyle =
    "inline-flex justify-center items-center rounded-lg px-2 py-2 text-black text-sm font-medium font-rubik";

  const bgColor =
    status === RequestStatus.Pickup ? "bg-[#FFF1C2]" : "bg-[#A0DEFF]";

  return (
    <div className={`${baseStyle} ${bgColor} w-24`}>
      <p className="truncate">{status}</p>
    </div>
  );
};

export default LoanStatusTag;
