"use client";
import React from "react";
import Image from "next/image";
import eal_logo from "@/assets/icons/eal_logo.svg";
import arrow from "@/assets/icons/keyboard_arrow_up.svg";
import profilePic from "@/assets/icons/reindeer.png";

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
  return (
    <div className="bg-[#F6FAFD] flex p-4 justify-between">
      <div className="gap-10 flex">
        <a href="/">
          <Image
            src={eal_logo}
            alt="English at Large Logo"
            style={imageStyle}
          />
        </a>
        <div className="relative group w-20 mt-2">
          <a className="text-md font-[family-name:var(--font-rubik)] font-semibold">
            Browse{" "}
            <Image src={arrow} alt="arrow down" className="-my-5 mx-16" />
          </a>

          <div className="absolute hidden bg-grey-200 group-hover:block min-w-[200px]">
            <div className="my-5 p-3 bg-white rounded-md w-40">
              <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                <ul className="pb-2">
                  <a href="dashboard/books" className="dropdown-item">
                    Books
                  </a>
                </ul>
                <ul className="pb-1">
                  <a href="dashboard/onlineresources" className="dropdown-item">
                    Online Resources
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group w-20 mt-2">
          <a className="text-md font-[family-name:var(--font-rubik)] font-semibold">
            Manage{" "}
            <Image src={arrow} alt="arrow down" className="-my-5 mx-16" />
          </a>

          <div className="absolute hidden bg-grey-200 group-hover:block min-w-[200px]">
            <div className="flex my-5 p-2 bg-white rounded-md w-20 justify-center">
              <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                <ul className="pb-2">
                  <a href="/dashboard/loans" className="dropdown-item">
                    Loans
                  </a>
                </ul>
                <ul className="pb-1">
                  <a href="dashboard/holds" className="dropdown-item">
                    Holds
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="relative group mt-2">
          <a
            href="dashboard/staff"
            className="font-[family-name:var(--font-rubik)] font-semibold"
          >
            Staff
          </a>
        </div>
      </div>

      <div className="flex row gap-3 mr-14 mt-2">
        <a href="/profile">
          <Image
            src={profilePic}
            alt="Profile Picture"
            style={profileStyle}
            className="w-8 h-8 rounded-full -mt-1"
          />
        </a>
        <div className="relative group w-28">
          <a className="text-md font-[family-name:var(--font-rubik)] font-semibold">
            Clarence Yeh
          </a>

          <div className="absolute hidden bg-grey-200 group-hover:block min-w-[200px]">
            <div className="p-3 mt-1 bg-white rounded-md w-20">
              <div className="dropdown-menu font-[family-name:var(--font-rubik)] whitespace-nowrap">
                <ul className="pb-2">
                  <a href="/login" className="dropdown-item">
                    Logout
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
