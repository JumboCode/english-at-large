"use client";
import React from "react";
import Image from "next/image";
import eal_logo from "@/assets/icons/eal_logo.svg";
import arrow from "@/assets/icons/keyboard_arrow_up.svg";
import profilePic from "@/assets/icons/reindeer.png";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import useCurrentUser from "@/lib/hooks/useCurrentUser";

const imageStyle = {
  minHeight: "40px",
  minWidth: "84px",
};

const profileStyle = {
  minHeight: "30px",
  minWidth: "30px",
  borderRadius: "full",
};

const NavBar = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const user = useCurrentUser();
  // useEffect to run when `user` changes

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  {
    if (user?.role === "Admin" && user?.role != undefined) {
      return (
        <div className="bg-[#F6FAFD] flex p-4 justify-between text-black">
          <div className="gap-10 flex">
            <Link href="/dashboard">
              <Image
                src={eal_logo}
                alt="English at Large Logo"
                style={imageStyle}
              />
            </Link>
            <div className="relative group w-20 mt-2">
              <p className="text-md font-[family-name:var(--font-rubik)] font-semibold">
                Browse{" "}
                <Image src={arrow} alt="arrow down" className="-my-5 mx-16" />
              </p>

              <div className="absolute hidden bg-grey-200 group-hover:block min-w-[200px]">
                <div className="my-5 p-3 bg-white rounded-md w-40">
                  <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                    <ul className="pb-2">
                      <Link href="/dashboard/books" className="dropdown-item">
                        Books
                      </Link>
                    </ul>
                    <ul className="pb-1">
                      <Link
                        href="/dashboard/onlineresources"
                        className="dropdown-item"
                      >
                        Online Resources
                      </Link>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group w-20 mt-2">
              <p className="text-md font-[family-name:var(--font-rubik)] font-semibold">
                Manage{" "}
                <Image src={arrow} alt="arrow down" className="-my-5 mx-16" />
              </p>

              <div className="absolute hidden bg-grey-200 group-hover:block min-w-[200px]">
                <div className="flex my-5 p-2 bg-white rounded-md w-20 justify-center">
                  <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                    <ul className="pb-2">
                      <Link href="/dashboard/loans" className="dropdown-item">
                        Loans
                      </Link>
                    </ul>
                    <ul className="pb-1">
                      <Link href="/dashboard/holds" className="dropdown-item">
                        Holds
                      </Link>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group mt-2">
              <Link
                href="staff"
                className="font-[family-name:var(--font-rubik)] font-semibold"
              >
                Staff
              </Link>
            </div>
          </div>
          <div className="flex row gap-3 mr-14 mt-2">
            <Link href="/profile">
              <Image
                src={profilePic}
                alt="Profile Picture"
                style={profileStyle}
                className="w-8 h-8 rounded-full -mt-1"
              />
            </Link>
            <div className="relative group w-28">
              <p className="text-md font-[family-name:var(--font-rubik)] font-semibold">
                {user?.name}
              </p>

              <div className="absolute hidden bg-grey-200 group-hover:block min-w-[100px] shadow-md">
                <div className="p-1 mt-1 bg-white rounded-md">
                  <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                    <ul>
                      <button
                        onClick={handleSignOut}
                        className="dropdown-item cursor-pointer w-full text-center hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (user?.role != undefined) {
      return (
        <div>
          <div className="bg-[#F6FAFD] flex p-4 justify-between text-black">
            <div className="gap-10 flex">
              <Link href="/dashboard">
                <Image
                  src={eal_logo}
                  alt="English at Large Logo"
                  style={imageStyle}
                />
              </Link>
              <div className="relative group w-20 mt-2">
                <p className="text-md font-[family-name:var(--font-rubik)] font-semibold">
                  Browse{" "}
                  <Image src={arrow} alt="arrow down" className="-my-5 mx-16" />
                </p>

                <div className="absolute hidden bg-grey-200 group-hover:block min-w-[200px]">
                  <div className="my-5 p-3 bg-white rounded-md w-40">
                    <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                      <ul className="pb-2">
                        <Link href="/dashboard/books" className="dropdown-item">
                          Books
                        </Link>
                      </ul>
                      <ul className="pb-1">
                        <Link
                          href="/dashboard/onlineresources"
                          className="dropdown-item"
                        >
                          Online Resources
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group w-20 mt-2">
                <p className="text-md font-[family-name:var(--font-rubik)] font-semibold">
                  Manage{" "}
                  <Image src={arrow} alt="arrow down" className="-my-5 mx-16" />
                </p>

                <div className="absolute hidden bg-grey-200 group-hover:block min-w-[200px]">
                  <div className="flex my-5 p-2 bg-white rounded-md w-20 justify-center">
                    <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                      <ul className="pb-2">
                        <Link href="/dashboard/loans" className="dropdown-item">
                          Loans
                        </Link>
                      </ul>
                      <ul className="pb-1">
                        <Link href="/dashboard/holds" className="dropdown-item">
                          Holds
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex row gap-3 mr-14 mt-2">
              <Link href="/profile">
                <Image
                  src={profilePic}
                  alt="Profile Picture"
                  style={profileStyle}
                  className="w-8 h-8 rounded-full -mt-1"
                />
              </Link>
              <div className="relative group w-28">
                <p className="text-md font-[family-name:var(--font-rubik)] font-semibold">
                  {user?.name}
                </p>

                <div className="absolute hidden bg-grey-200 group-hover:block min-w-[100px] shadow-md">
                  <div className="p-1 mt-1 bg-white rounded-md">
                    <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                      <ul>
                        <button
                          onClick={handleSignOut}
                          className="dropdown-item cursor-pointer w-full text-center hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          Logout
                        </button>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
};

export default NavBar;
