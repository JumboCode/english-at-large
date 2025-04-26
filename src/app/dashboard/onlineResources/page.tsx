"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import DisplayFolder from "@/components/common/DisplayFolder";
import { getAllSubFolders, getFolderResources } from "@/lib/api/drive";
import LoadingSkeleton from "@/app/loading";

const OnlineResourcesPage = () => {
  const [resourceFolders, setResourceFolders] = useState<
    { name: string; id: string; count: number }[]
  >([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  useEffect(() => {
    const fetchSubFolders = async () => {
      setLoadingFolders(true);
      const folders = await getAllSubFolders(
        "1K6S8q9I9Qk0O0Dikf3sME9K_sHEwXSTs"
      );

      const folderData = await Promise.all(
        folders
          .filter(
            (folder) => folder.mimeType === "application/vnd.google-apps.folder"
          )
          .map(async (folder) => {
            const response = await getFolderResources(folder.id);
            return {
              name: folder.name ?? "",
              id: folder.id ?? "",
              count: response ?? 0,
            };
          })
      ).finally(() => setLoadingFolders(false));
      setResourceFolders(folderData);
    };

    fetchSubFolders();
  }, []);

  return (
    <div>
      {loadingFolders ? (
        <LoadingSkeleton />
      ) : (
        <div className="p-4 px-16 bg-white border-t">
          <div className="flex flex-row text-left whitespace-normal">
            <p className="text-sm text-slate-500 mb-6">
              {resourceFolders.reduce((acc, cur) => {
                return cur.count + acc;
              }, 0)}
              {" resources"}
            </p>
          </div>
          <div>
            <ul className="grid grid-cols-2 gap-4">
              {resourceFolders.map((folder) => {
                if (folder.name && folder.id)
                  return (
                    <li key={folder.id}>
                      <div className="p-4 border-gray-200 border bg-white shadow-md rounded-md hover:bg-blue-100 transition duration-200 mb-10">
                        <DisplayFolder resource={folder} />
                      </div>
                    </li>
                  );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineResourcesPage;
