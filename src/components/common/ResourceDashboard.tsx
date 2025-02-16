"use client";
import { OnlineResource } from "@prisma/client";
import ResourceInfo from "./ResourceInfo";

interface ResourceDProps {
  resources: OnlineResource[];
}

const ResourceDashboard = (props: ResourceDProps) => {
  const { resources } = props;

  const groupedResources: Record<string, OnlineResource[]> = {};

  resources.forEach((item) => {
    if (!groupedResources[item.format]) {
      groupedResources[item.format] = [];
    }
    groupedResources[item.format].push(item); // has the resources divided into arrays (divided by OnlineResource Format)
  });

  //   console.log("GROUP ARRAY", groupedResources)

  return (
    <div>
      {Object.keys(groupedResources).map((format) => (
        <div key={format}>
          <div className="flex flex-row">
            <h1 className="bg-white text-black font-bold text-3xl font-[family-name:var(--font-rubik)] mb-5">
              {format + "s (" + groupedResources[format].length + ")"}
            </h1>
            <button className="text-[#757575] text-sm ml-auto">View all</button>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {groupedResources[format].slice(0, 2).map((item) => (
              <li key={item.id}>
                <div className="p-4 border-gray-200 border bg-white shadow-md rounded-md  hover:bg-blue-100 transition duration-200 mb-10">
                  <ResourceInfo resource={item} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ResourceDashboard;
