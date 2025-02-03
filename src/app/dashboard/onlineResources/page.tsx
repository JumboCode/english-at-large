"use client";
import React from "react";
import OnlineResourceForm from "@/components/common/forms/OnlineResourceForm";
import { useState, useEffect, useCallback } from "react";
import { OnlineResource, BookSkills, BookLevel, ResourceFormat, ResourceTopic } from "@prisma/client";
import SearchBar from "@/components/SearchBar";
import FilterPopup from "@/components/common/FilterPopup";
import BookForm from "@/components/common/forms/BookForm";
import CommonButton from "@/components/common/button/CommonButton";
import FilterIcon from "@/assets/icons/Filter";
import AddIcon from "@/assets/icons/Add";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { usePopup } from "@/lib/context/ConfirmPopupContext";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import ResourceInfo from "@/components/common/ResourceInfo";

enum formState {
  FORM_CLOSED,
  ISBN_FORM_OPEN,
  BOOK_FORM_OPEN,
}

const OnlineResourcesPage = () => {
  const user = useCurrentUser();

  const [resources, setResources] = useState<OnlineResource[]>([]);
  const [formShown, setFormShown] = useState<formState>(formState.FORM_CLOSED);
  // const [bookFormShown, setBookFormShown] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [skills, setSkills] = useState<BookSkills[]>([]);
  const [levels, setLevels] = useState<BookLevel[]>([]);
  const [format, setFormat] = useState<ResourceFormat>();
  const [topic, setTopic] = useState<ResourceTopic>();

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
      .filter(
        (resource) =>
          resource.name.toLowerCase().includes(searchData)
      )
      // .sort((a, b) => sortBooks(a, b))
      .filter((resource) => filterResources(resource));

  useEffect(() => {
    const dummyResources: OnlineResource[] = [
      {
        id: "1",
        createdAt: new Date(),
        name: "The Pragmatic Programmer",
        link: "Andrew Hunt, David Thomas",
        level: "Beginner",
        topic: "Holidays",
        skills: ["Reading", "Writing"],
        format: "PDF"
      },
      {
        id: "2",
        createdAt: new Date(),
        name: "The Pragmatic Programmer",
        link: "Andrew Hunt, David Thomas",
        level: "Beginner",
        topic: "Holidays",
        skills: ["Reading", "Writing"],
        format: "PDF"
      },
      {
        id: "3",
        createdAt: new Date(),
        name: "The Pragmatic Programmer",
        link: "Andrew Hunt, David Thomas",
        level: "Beginner",
        topic: "Holidays",
        skills: ["Reading", "Writing"],
        format: "PDF"
      },
      {
        id: "4",
        createdAt: new Date(),
        name: "The Pragmatic Programmer",
        link: "Andrew Hunt, David Thomas",
        level: "Beginner",
        topic: "Holidays",
        skills: ["Reading", "Writing"],
        format: "PDF"
      },
      {
        id: "5",
        createdAt: new Date(),
        name: "The Pragmatic Programmer",
        link: "Andrew Hunt, David Thomas",
        level: "Beginner",
        topic: "Holidays",
        skills: ["Reading", "Writing"],
        format: "PDF"
      },
    ];
    const fetchData = async () => {
      try {
        const allResources = dummyResources;
        if (allResources) {
          setResources(allResources);
        }
      } catch (err) {
        console.error("Failed to get all books");
      }
    };
    fetchData();
  }, []);


  return formShown == formState.BOOK_FORM_OPEN ? (
    // change to resource form
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
              label="Create Book"
              leftIcon={<AddIcon />}
              onClick={() => setFormShown(formState.ISBN_FORM_OPEN)}
              altTextStyle="text-white"
              altStyle="bg-dark-blue"
            />
          ) : null
        }
        placeholderText="Search for books"
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
        status={status}
        setStatus={setStatus}
        sortBook={bookSortBy}
        setSortBook={setBookSortBy}
      /> */}
      <div className="p-4 px-16 bg-white border-t">
        <div className="text-left">
          <div className="whitespace-normal">
            <p className="text-sm text-slate-500 mb-6">
              {subsetResources.length} {"resources"}
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subsetResources.map((resource, index) => (
            <li key={index}>
              <div>
                {/* TODO: add grey border to this */}
                <div className="p-4 border-gray-200 border bg-white shadow-md rounded-md  hover:bg-blue-100 transition duration-200">
                  <ResourceInfo resource={resource} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// const OnlineResourcesPage = () => {
//   const [formShown, setFormShown] = useState<formState>(formState.FORM_CLOSED);

//   return <OnlineResourceForm exit={() => setFormShown(formState.FORM_CLOSED)}
//   existingResource={null}></OnlineResourceForm>
// }

export default OnlineResourcesPage;
