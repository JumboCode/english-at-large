import DropArrowIcon from "@/assets/icons/DropArrow";
import SmallCheckIcon from "@/assets/icons/SmallCheck";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";

interface DropdownProps {
  items: string[];
}

const CommonDropdown = (props: DropdownProps) => {
  const { items } = props;
  const [filterType, setFilterType] = useState<string>("All");

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex min-w-28 w-full justify-center gap-2 rounded-lg bg-white p-3  text-gray-900 hover:bg-gray-50 border border-dark-blue">
          <p className="text-sm font-medium text-dark-blue font-[family-name:var(--font-rubik)]">
            {filterType}
          </p>
          <DropArrowIcon />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div>
          {items.map((item, index) => {
            return (
              <MenuItem key={index}>
                <button
                  onClick={() => setFilterType(item)}
                  className="block px-4 py-2 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none w-full"
                >
                  <div className="flex justify-between">
                    <p className="text-sm text-black">{item}</p>
                    {filterType == item ? <SmallCheckIcon /> : <div />}
                  </div>
                </button>
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default CommonDropdown;
