"use client";
import { getRequests } from "@/lib/api/requests";

import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Chart } from "react-google-charts";

interface TableOverviewProps {
  filterInfo: string; // TODO: change this prop as needed
  requestCount: number;
  range: DateRange | undefined;
}
const TableOverview = (props: TableOverviewProps) => {
  const { filterInfo, requestCount, range } = props;
  const [mapLevel, setMapLevel] = useState<Map<string, number> | null>(null);
  const [mapSkills, setMapSkills] = useState<Map<string, number> | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const reqs = await getRequests(range?.from, range?.to);
      const books = reqs?.map((req) => req.book);

      const levels = new Map<string, number>([
        ["Beginner", 0],
        ["High_Beginner", 0],
        ["Low_Intermediate", 0],
        ["Intermediate", 0],
        ["High_Intermediate", 0],
        ["Advanced", 0],
      ]);

      const skills = new Map<string, number>([
        ["Grammar", 0],
        ["Vocab_Building", 0],
        ["Reading", 0],
        ["Writing", 0],
        ["Speaking", 0],
        ["Listening", 0],
        ["Pronounciation", 0],
      ]);

      if (books) {
        books.map((book) => {
          if (book.level) {
            levels.set(book.level, (levels.get(book.level) ?? 0) + 1);
          }
          if (book.skills) {
            book.skills.map((skill) => {
              skills.set(skill, (skills.get(skill) ?? 0) + 1);
            });
          }
        });

        setMapLevel(levels);
        setMapSkills(skills);
      } else {
        return;
      }
    };

    fetchBooks();
  }, [range]);

  return (
    <div className="flex flex-col mt-6 mx-16 text-xl font-medium text-center gap-6">
      <div className="grid grid-cols-3 gap-6">
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
              {requestCount !== undefined && requestCount !== null
                ? requestCount
                : "loading..."}
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

      <div className="grid grid-cols-2 gap-6">
        <div className="w-full h-96 bg-transparent p-6 outline outline-2 outline-[#D4D4D4] text-black items-start rounded-[4] text-start">
          <div className="flex flex-col gap-2 ">
            <p className="text-2xl font-bold">No. of books in each level</p>
            <p className="text-[#757575] font-normal text-base">As of today</p>
          </div>
          {!mapLevel ? null : (
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="100%"
              style={{ background: "transparent" }}
              data={[
                ["Level", "Count", { role: "style" }],
                ["Beginner", mapLevel.get("Beginner") ?? 0, "#202D74"],
                [
                  "High Beginner",
                  mapLevel.get("High_Beginner") ?? 0,
                  "#202D74",
                ],
                [
                  "Low Intermediate",
                  mapLevel.get("Low_Intermediate") ?? 0,
                  "#202D74",
                ],
                ["Intermediate", mapLevel.get("Intermediate"), "#202D74"],
                [
                  "High Intermediate",
                  mapLevel.get("High_Intermediate") ?? 0,
                  "#202D74",
                ],
                ["Advanced", mapLevel.get("Advanced") ?? 0, "color: #202D74"],
              ]}
              options={{
                tooltip: {
                  textStyle: {
                    fontName: "Rubik",
                  },
                },
                chartArea: { top: 10, width: "100%", height: "70%" },
                legend: { position: "none" },
                vAxis: {
                  textPosition: "none",
                  minValue: 0,
                  gridlines: { color: "#D9D9D9" },
                  minorGridlines: { color: "#D9D9D9" },
                },
                backgroundColor: "transparent",
                hAxis: {
                  textStyle: {
                    fontName: "Rubik",
                    fontSize: 10,
                    fontWeight: 5,
                    color: "#000000",
                  },
                },
              }}
            />
          )}
        </div>
        <div className="w-full h-96 bg-transparent p-6 outline outline-2 outline-[#D4D4D4] text-black items-start rounded-[4] text-start">
          <div className="flex flex-col gap-2 ">
            <p className="text-2xl font-bold">No. of books in each category</p>
            <p className="text-[#757575] font-normal text-base">As of today</p>
          </div>
          {!mapSkills ? null : (
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="100%"
              style={{ background: "transparent" }}
              data={[
                [
                  { label: "Skill", id: "Skill" },
                  { label: "Count", id: "Count" },
                  { role: "style" },
                ],
                [
                  { v: "Grammar", f: "Grammar" },
                  mapSkills.get("Grammar") ?? 0,
                  "#7890CD",
                ],
                [
                  { v: "Vocab Building", f: "Vocab Building" },
                  mapSkills.get("Vocab_Building") ?? 0,
                  "#7890CD",
                ],
                [
                  { v: "Reading", f: "Reading" },
                  mapSkills.get("Reading") ?? 0,
                  "#7890CD",
                ],
                [
                  { v: "Writing", f: "Writing" },
                  mapSkills.get("Writing") ?? 0,
                  "#7890CD",
                ],
                [
                  { v: "Speaking", f: "Speaking" },
                  mapSkills.get("Speaking") ?? 0,
                  "#7890CD",
                ],
                [
                  { v: "Listening", f: "Listening" },
                  mapSkills.get("Listening") ?? 0,
                  "#7890CD",
                ],
                [
                  { v: "Pronunciation", f: "Pronunciation" },
                  mapSkills.get("Pronounciation") ?? 0,
                  "#7890CD",
                ],
              ]}
              options={{
                tooltip: {
                  textStyle: {
                    fontName: "Rubik",
                  },
                },
                chartArea: { top: 10, width: "100%", height: "65%" },
                legend: { position: "none" },
                vAxis: {
                  textPosition: "none",
                  minValue: 0,
                  gridlines: { color: "#D9D9D9" },
                  minorGridlines: { color: "#D9D9D9" },
                },
                backgroundColor: "transparent",
                hAxis: {
                  textStyle: {
                    fontName: "Rubik",
                    fontSize: 10,
                    fontWeight: 5,
                    color: "#000000",
                  },
                  maxAlternation: 2,
                  showTextEvery: 1,
                  minTextSpacing: 0,
                  title: "",
                },
                bar: { groupWidth: "70%" },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableOverview;
