"use client";
import React, { useEffect } from "react";
import OnlineResourceForm from "@/components/common/forms/OnlineResourceForm";
import { useState } from "react";
// import {
//   OnlineResource,
//   BookSkills,
//   BookLevel,
//   // ResourceFormat,
//   // ResourceTopic,
// } from "@prisma/client";
import SearchBar from "@/components/SearchBar";
// import FilterPopup from "@/components/common/FilterPopup";
import CommonButton from "@/components/common/button/CommonButton";
// import FilterIcon from "@/assets/icons/Filter";
import AddIcon from "@/assets/icons/Add";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import DisplayFolder from "@/components/common/DisplayFolder";
import axios from "axios";

enum formState {
  FORM_CLOSED,
  RESOURCE_FORM_OPEN,
}

const OnlineResourcesPage = () => {
  const user = useCurrentUser();
  const [formShown, setFormShown] = useState<formState>(formState.FORM_CLOSED);
  // const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // states needed for filter functionality -- don't delete!!
  // const [format, setFormat] = useState<ResourceFormat>();
  // const [topic, setTopic] = useState<ResourceTopic>();

  // from books dashboard, delete when filter implemented
  // const [bookSortBy, setBookSortBy] = useState<string>("By Title");

  const { hidePopup, popupStatus } = usePopup();
  // const [searchData, setSearchData] = useState("");

  // const toggleFilterPopup = () => {
  //   setIsFilterOpen(!isFilterOpen);
  // };

  // const filterResources = useCallback(
  //   (resource: {
  //     id: string;
  //     kind: string;
  //     mimeType: string;
  //     name: string;
  //   }) => {
  //     return (
  //       (skills.length === 0 ||
  //         skills.some((skill) => resource.skills.includes(skill))) &&
  //       (levels.length === 0 || levels.includes(resource.level))
  //     );
  //   },
  //   [levels, skills]
  // );

  // const subsetResources = structuredClone<
  //   {
  //     id: string;
  //     kind: string;
  //     mimeType: string;
  //     name: string;
  //   }[]
  // >(resourceFolders).filter((resource) =>
  //   resource.name.toLowerCase().includes(searchData)
  // );
  // .filter((resource) => filterResources(resource));

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
  }, []);

  return formShown == formState.RESOURCE_FORM_OPEN ? (
    <OnlineResourceForm
      exit={() => setFormShown(formState.FORM_CLOSED)}
      existingResource={null}
    />
  ) : (
    <div>
      <SearchBar
        setSearchData={(_: string) => {}}
        button={
          // <CommonButton
          //   label="Filter"
          //   leftIcon={<FilterIcon />}
          //   onClick={toggleFilterPopup}
          // />
          null
        }
        button2={
          user?.role === "Admin" ? (
            <CommonButton
              label="Add new"
              leftIcon={<AddIcon />}
              onClick={() => setFormShown(formState.RESOURCE_FORM_OPEN)}
              altTextStyle="text-white"
              altStyle="bg-dark-blue"
            />
          ) : null
        }
        placeholderText="Search for resources"
      />
      {popupStatus.shown ? (
        <ConfirmationPopup
          type={popupStatus.type}
          action={popupStatus.action}
          success={popupStatus.success}
          onDisappear={() => hidePopup()}
          custom={popupStatus.custom}
        />
      ) : null}

      {/* <FilterPopup
        isOpen={isFilterOpen}
        toggle={toggleFilterPopup}
        skills={skills}
        setSkills={setSkills}
        levels={levels}
        setLevels={setLevels}
        sortBook={bookSortBy}
        setSortBook={setBookSortBy}
      /> */}
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
