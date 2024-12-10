import React, { useEffect, useState } from "react";
import DropArrowIcon from "@/assets/icons/DropArrow";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BookRequest, BookStatus } from "@prisma/client";

interface DropdownProps {
  report: BookRequest;
  selectedValue: string;
  updateReq: (arg0: BookRequest) => void;
}

const LoanDropdown = (props: DropdownProps) => {
  const { report, selectedValue, updateReq } = props;
  const [filterType, setFilterType] = useState<BookStatus>(report.status);

  useEffect(() => {
    setFilterType(report.status);
  }, [report.status, selectedValue]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        {filterType == BookStatus.Pickup ? (
          <MenuButton className="inline-flex min-w-20 w-auto justify-center gap-1 rounded-lg bg-[#FFF1C2] p-2 text-black hover:bg-blue-600">
            <p className="text-sm font-medium font-rubik">{filterType}</p>
            <DropArrowIcon />
          </MenuButton>
        ) : (
          <MenuButton className="inline-flex min-w-20 w-auto justify-center gap-1 rounded-lg bg-[#A0DEFF] p-2 text-black hover:bg-blue-600">
            <p className="text-sm font-medium font-rubik">{filterType}</p>
            <DropArrowIcon />
          </MenuButton>
        )}
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div>
          <MenuItem key={0}>
            {filterType == BookStatus.Pickup ? (
              <button
                onClick={() => {
                  setFilterType(BookStatus.Borrowed);
                  updateReq({ ...report, status: BookStatus.Borrowed });
                }}
                className="block px-4 py-2 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
              >
                <div className="flex justify-between">
                  <p className="text-sm text-black">Borrowed</p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setFilterType(BookStatus.Pickup);
                  updateReq({ ...report, status: BookStatus.Pickup });
                }}
                className="block px-4 py-2 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
              >
                <div className="flex justify-between">
                  <p className="text-sm text-black">Pick-up</p>
                </div>
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default LoanDropdown;
