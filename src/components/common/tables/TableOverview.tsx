"use client";
import React from "react";

interface TableOverviewProps {
  filterInfo: string; // TODO: change this prop as needed
  requestCount: number;
}
const TableOverview = (props: TableOverviewProps) => {
  const { filterInfo, requestCount } = props;

  return (
    <div className="mt-6 mx-16 text-xl font-medium text-center">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col w-full aspect-[16/6] bg-[#F6FAFD] outline outline-2 outline-[#D4D4D4] text-black items-start justify-center p-6 rounded-[4] gap-2">
          <div>
            <p className="text-xl font-semibold">Books Borrowed: </p>
          </div>
          <div>
            <p
              className={`${
                requestCount ? "text-4xl" : "text-2xl h-10"
              } font-medium`}
            >
              {requestCount ? requestCount : "loading..."}
            </p>
          </div>
          <div>
            <p className="text-[#757575] font-normal">{filterInfo}</p>
          </div>
        </div>

        <div className="flex flex-col w-full aspect-[16/6] bg-[#F6FAFD] outline outline-2 outline-[#D4D4D4] text-black items-start justify-center p-6 rounded-[4] gap-2">
          <div>
            <p className="text-xl font-semibold">Books Added: </p>
          </div>
          <div>
            <p className="text-4xl font-medium">10</p>
          </div>
          <div>
            <p className="text-[#757575] font-normal">{filterInfo}</p>
          </div>
        </div>
        <div className="flex flex-col w-full aspect-[16/6] bg-[#F6FAFD] outline outline-2 outline-[#D4D4D4] text-black items-start justify-center p-6 rounded-[4] gap-2">
          <div>
            <p className="text-xl font-semibold">Books Removed: </p>
          </div>
          <div>
            <p className="text-4xl font-medium">10</p>
          </div>
          <div>
            <p className="text-[#757575] font-normal">{filterInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOverview;
