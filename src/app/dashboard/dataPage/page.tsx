"use client";
import React, { useState } from "react";
import CommonDropdown from "@/components/common/forms/Dropdown";
import CalendarMonthIcon from "@/assets/icons/calendar_month";
import BookCatalog from "@/components/common/tables/BookCatalog";
import UserHistory from "@/components/common/tables/UserHistory";

export default function DataPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [filter, setFilter] = useState<string>("");
  const filterText = filter ? filter : "All time";
  return (
    <div>
      <div className="bg-white px-16 pt-12">
        <h1 className="text-black font-bold text-3xl font-[family-name:var(--font-rubik)] mb-4">
          Dashboard
        </h1>
        <div className="flex justify-between">
          <div className="w-fit">
            <div className="flex">
              {["Overview", "Book Catalog", "User History"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-8 text-md ${
                    activeTab === tab
                      ? "border-b-2 border-[#202D74] text-[#202D74]"
                      : "border-b-2 text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex">
            <CommonDropdown
              items={["All time", "Last 4 weeks", "Last year"]}
              buttonText={"All time"}
              altButtonStyle="min-w-28"
              leftIcon={<CalendarMonthIcon />}
              setFilter={setFilter}
            />
          </div>
        </div>

        {/* Tab Content */}
      </div>
      {activeTab === "Overview" && (
        <div className="mt-6 text-xl font-medium text-center">
          <div className="flex justify-center gap-4">
            <div className="w-1/4 min-h-32 bg-gray-200 outline outline-gray-500 text-black flex items-center p-4 rounded-lg">
              <p className="text-lg">Books borrowed: 10 ({filterText})</p>
            </div>
            <div className="w-1/4 min-h-32 bg-gray-200 outline outline-gray-500 text-black flex items-center p-4 rounded-lg">
              <p className="text-lg">Books added: 7 ({filterText})</p>
            </div>
            <div className="w-1/4 min-h-32 bg-gray-200 outline outline-gray-500 text-black flex items-center p-4 rounded-lg">
              <p className="text-lg">Books removed: 2 ({filterText})</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === "Book Catalog" && <BookCatalog />}
      {activeTab === "User History" && <UserHistory />}
    </div>
  );
}
