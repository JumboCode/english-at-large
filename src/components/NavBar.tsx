"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import eal_logo from "@/assets/icons/eal_logo.svg";
import arrow from "@/assets/icons/keyboard_arrow_up.svg";
import profilePic from "@/assets/icons/reindeer.png";

import useCurrentUser from "@/lib/hooks/useCurrentUser";

// Consistent styles extracted to separate constants
const STYLES = {
  logo: {
    minHeight: "40px",
    minWidth: "84px",
  },
  profilePic: {
    minHeight: "30px",
    minWidth: "30px",
    borderRadius: "full",
  },
};

// Reusable dropdown menu component
const DropdownMenu = ({
  title,
  items,
  titleClassName = "text-md font-[family-name:var(--font-rubik)] font-semibold",
  menuClassName = "absolute hidden bg-grey-200 group-hover:block min-w-[200px]",
}: {
  title: string;
  items: { href: string; label: string }[];
  titleClassName?: string;
  menuClassName?: string;
}) => (
  <div className="relative group w-20 mt-2">
    <p className={titleClassName}>
      {title} <Image src={arrow} alt="arrow down" className="-my-5 mx-16" />
    </p>
    <div className={menuClassName}>
      <div className="my-5 p-3 bg-white rounded-md w-40">
        <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
          {items.map((item, index) => (
            <ul key={index} className="pb-2">
              <Link href={item.href} className="dropdown-item">
                {item.label}
              </Link>
            </ul>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Reusable user menu component
const UserMenu = ({
  name,
  onSignOut,
}: {
  name: string | null;
  onSignOut: () => Promise<void>;
}) => (
  <div className="relative group w-28">
    <p className="text-md font-[family-name:var(--font-rubik)] font-semibold">
      {name}
    </p>
    <div className="absolute hidden bg-grey-200 group-hover:block min-w-[100px] shadow-md">
      <div className="p-1 mt-1 bg-white rounded-md">
        <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
          <ul>
            <button
              onClick={onSignOut}
              className="dropdown-item cursor-pointer w-full text-center hover:bg-gray-100 px-2 py-1 rounded"
            >
              Logout
            </button>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const NavBar = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const user = useCurrentUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Early return if user is undefined
  if (!user)
    return (
      <div className="bg-[#F6FAFD] flex p-4 justify-between text-black h-[72]" />
    );

  // Prepare common navigation items
  const browseItems = [
    { href: "/dashboard/books", label: "Books" },
    { href: "/dashboard/onlineResources", label: "Online Resources" },
  ];

  // Render different navbar based on user role
  return (
    <div className="bg-[#F6FAFD] flex p-4 justify-between text-black">
      <div className="gap-10 flex">
        {/* Logo */}
        <Link href="/dashboard">
          <Image
            src={eal_logo}
            alt="English at Large Logo"
            style={STYLES.logo}
          />
        </Link>
        <div className="relative group mt-2">
          <Link
            href="/dashboard/datapage"
            className="font-[family-name:var(--font-rubik)] font-semibold"
          >
            Dashboard
          </Link>
        </div>

        {/* Browse Dropdown */}
        <DropdownMenu title="Browse" items={browseItems} />

        {/* Role-specific navigation */}
        {user.role === "Admin" ? (
          <>
            <DropdownMenu
              title="Manage"
              items={[
                { href: "/dashboard/loans", label: "Loans" },
                { href: "/dashboard/holds", label: "Holds" },
              ]}
            />
            <div className="relative group mt-2">
              <Link
                href="/dashboard/users"
                className="font-[family-name:var(--font-rubik)] font-semibold"
              >
                Users
              </Link>
            </div>
          </>
        ) : (
          <div className="relative group mt-2">
            <Link
              href={"/dashboard/shelf/" + user?.id}
              className="font-[family-name:var(--font-rubik)] font-semibold"
            >
              Shelf
            </Link>
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="flex row gap-3 mr-14 mt-2">
        {/* Profile Picture */}
        <Image
          src={profilePic}
          alt="Profile Picture"
          style={STYLES.profilePic}
          className="w-8 h-8 rounded-full -mt-1"
        />

        {/* User Menu */}
        <UserMenu name={user?.name} onSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default NavBar;
