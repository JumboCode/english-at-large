import DropArrowIcon from "@/assets/icons/DropArrow";
import SmallCheckIcon from "@/assets/icons/SmallCheck";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";

const Dropdown = () => {
  const [filterType, setFilterType] = useState<string>("All");

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex min-w-28 w-full justify-center gap-2 rounded-lg bg-white p-3  text-gray-900 hover:bg-gray-50 border border-dark-blue">
          <p className="text-sm text-medium text-dark-blue">{filterType}</p>
          <DropArrowIcon />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div>
          <MenuItem>
            <button
              onClick={() => setFilterType("All")}
              className="block px-4 py-2 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
            >
              <div className="flex justify-between">
                <p className="text-sm text-black">All</p>
                {filterType == "All" ? <SmallCheckIcon /> : <div />}
              </div>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => setFilterType("Tutors")}
              className="block px-4 py-2 w-full data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              <div className="flex justify-between">
                <p className="text-sm text-black">Tutors</p>
                {filterType == "Tutors" ? <SmallCheckIcon /> : <div />}
              </div>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => setFilterType("Admins")}
              className="block px-4 py-2 w-full data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              <div className="flex justify-between">
                <p className="text-sm text-black">Admins</p>
                {filterType == "Admins" ? <SmallCheckIcon /> : <div />}
              </div>
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => setFilterType("Pending")}
              className="block w-full px-4 py-2 text-left w-full data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              <div className="flex justify-between">
                <p className="text-sm text-black">Pending Invites</p>
                {filterType == "Pending" ? <SmallCheckIcon /> : <div />}
              </div>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default Dropdown;
