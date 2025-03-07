"use client";
import React from "react";
import OnlineResourceForm from "@/components/common/forms/OnlineResourceForm";
import { useState, useEffect, useCallback } from "react";
import {
  OnlineResource,
  BookSkills,
  BookLevel,
  // ResourceFormat,
  // ResourceTopic,
} from "@prisma/client";
import SearchBar from "@/components/SearchBar";
import FilterPopup from "@/components/common/FilterPopup";
import CommonButton from "@/components/common/button/CommonButton";
import FilterIcon from "@/assets/icons/Filter";
import AddIcon from "@/assets/icons/Add";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import ResourceDashboard from "@/components/common/ResourceDashboard";
import { getAllResources } from "@/lib/api/resources";

enum formState {
  FORM_CLOSED,
  RESOURCE_FORM_OPEN,
}

const OnlineResourcesPage = () => {
  const user = useCurrentUser();

  const [resources, setResources] = useState<OnlineResource[]>([]);
  const [formShown, setFormShown] = useState<formState>(formState.FORM_CLOSED);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [skills, setSkills] = useState<BookSkills[]>([]);
  const [levels, setLevels] = useState<BookLevel[]>([]);

  // states needed for filter functionality -- don't delete!!
  // const [format, setFormat] = useState<ResourceFormat>();
  // const [topic, setTopic] = useState<ResourceTopic>();

  // from books dashboard, delete when filter implemented
  const [bookSortBy, setBookSortBy] = useState<string>("By Title");

  const { hidePopup, popupStatus } = usePopup();
  const [searchData, setSearchData] = useState("");

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filterResources = useCallback(
    (resource: OnlineResource) => {
      return (
        (skills.length === 0 ||
          skills.some((skill) => resource.skills.includes(skill))) &&
        (levels.length === 0 || levels.includes(resource.level))
      );
    },
    [levels, skills]
  );

  // const sortBooks = useCallback(
  //   (a: OnlineResource, b: OnlineResource) => {
  //     if (bookSortBy === "By Title") {
  //       return (
  //         a.title.localeCompare(b.title) || a.author.localeCompare(b.author)
  //       );
  //     } else if (bookSortBy === "By Author") {
  //       return (
  //         a.author.localeCompare(b.author) || a.title.localeCompare(b.title)
  //       );
  //     } else if (bookSortBy === "By Release Date") {
  //       return (a.releaseDate || 0) < (b.releaseDate || 0) ? -1 : 1;
  //     }
  //     return 0;
  //   },
  //   [bookSortBy]
  // );

  const subsetResources = structuredClone<OnlineResource[]>(resources)
    .filter((resource) => resource.name.toLowerCase().includes(searchData))
    // .sort((a, b) => sortBooks(a, b))
    .filter((resource) => filterResources(resource));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allResources = await getAllResources();
        if (allResources) {
          setResources(allResources);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error("Failed to get all books");
      }
    };
    fetchData();
  }, []);

  return formShown == formState.RESOURCE_FORM_OPEN ? (
    <OnlineResourceForm
      exit={() => setFormShown(formState.FORM_CLOSED)}
      existingResource={null}
    />
  ) : (
    <div>
      <SearchBar
        setSearchData={setSearchData}
        button={
          <CommonButton
            label="Filter"
            leftIcon={<FilterIcon />}
            onClick={toggleFilterPopup}
          />
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

      <FilterPopup
        isOpen={isFilterOpen}
        toggle={toggleFilterPopup}
        skills={skills}
        setSkills={setSkills}
        levels={levels}
        setLevels={setLevels}
        sortBook={bookSortBy}
        setSortBook={setBookSortBy}
      />
      <div className="p-4 px-16 bg-white border-t">
        <div className="flex flex-row">
          <div className="text-left">
            <div className="whitespace-normal">
              <p className="text-sm text-slate-500 mb-6">
                {subsetResources.length} {"resources"}
              </p>
            </div>
          </div>
          <div className="flex items-center flex-row space-x-3 align-middle ml-auto">
            <label htmlFor="level" className="text-md semi-bold">
              Level
            </label>
            <select
              id="level"
              name="level"
              className="border-[1px] border-medium-grey-border border-solid rounded-lg block h-9 text-sm w-48 indent-2"
              onChange={undefined} // need to implement filtering
              defaultValue={"All"}
              required
            >
              <option value="">Select Level</option>
              {Object.values(BookLevel).map((ResourceLevel, index) => {
                return (
                  <option key={index} value={ResourceLevel}>
                    {ResourceLevel.replace("_", " ")}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <ResourceDashboard resources={subsetResources}></ResourceDashboard>
      </div>
    </div>
  );
};

export default OnlineResourcesPage;
