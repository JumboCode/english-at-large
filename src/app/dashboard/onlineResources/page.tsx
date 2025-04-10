"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import DisplayFolder from "@/components/common/DisplayFolder";
import axios from "axios";

const OnlineResourcesPage = () => {
  const [resourceFolders, setResourceFolders] = useState<
    { name: string; id: string; count: number }[]
  >([
    {
      id: "",
      name: "Beginner",
      count: 0,
    },
    {
      id: "",
      name: "High Beginner",
      count: 0,
    },
    {
      id: "",
      name: "Low Intermediate",
      count: 0,
    },
    {
      id: "15n8IHcAu7yYQa1HBmyJRTjfLP3aBUK0S",
      name: "Intermediate",
      count: 0,
    },
    {
      id: "",
      name: "High Intermediate",
      count: 0,
    },
    { id: "", name: "Advanced", count: 0 },
    {
      id: "1K6S8q9I9Qk0O0Dikf3sME9K_sHEwXSTs",
      name: "Other",
      count: 0,
    },
  ]);

  useEffect(() => {
    const fetchSubFolders = async () => {
      const counted = await Promise.all(
        resourceFolders.map(async (folder) => {
          if (folder.id) {
            const response = await axios.get(
              `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents&key=${process.env.NEXT_PUBLIC_DRIVE_API_KEY}`
            );
            if (response) {
              folder.count = response.data.files.length;
            }
          }
          return folder;
        })
      );
      setResourceFolders(counted);
    };

    fetchSubFolders();
  });

  return (
    <div>
      <div className="p-4 px-16 bg-white border-t">
        <div className="flex flex-row text-left whitespace-normal">
          <p className="text-sm text-slate-500 mb-6">
            {resourceFolders.reduce((acc, cur) => {
              return cur.count + acc;
            }, 0)}{" "}
            {"resources"}
          </p>
        </div>
        <div>
          <ul className="grid grid-cols-2 gap-4">
            {resourceFolders.map((folder) => (
              <li key={folder.name}>
                <div className="p-4 border-gray-200 border bg-white shadow-md rounded-md hover:bg-blue-100 transition duration-200 mb-10">
                  <DisplayFolder resource={folder} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OnlineResourcesPage;
