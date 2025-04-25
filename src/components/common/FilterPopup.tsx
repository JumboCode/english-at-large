"use client";
import { useState } from "react";
import { BookSkills, BookLevel } from "@prisma/client";
import MultiSelectTagButton from "./forms/MultiSelectTagButton";
import { CustomChangeEvent } from "@/lib/util/types";
import TagButton from "./button/TagButton";
import CommonButton from "./button/CommonButton";

interface FilterPopupProps {
  isOpen: boolean;
  toggle: () => void;
  skills: BookSkills[];
  setSkills: (skill: BookSkills[]) => void;
  levels: BookLevel[];
  setLevels: (level: BookLevel[]) => void;
  bookAvailable?: boolean;
  setBookAvailable?: (status: boolean) => void;
  sortBook: string;
  setSortBook: (sort: string) => void;
}

const FilterPopup = (props: FilterPopupProps) => {
  const {
    isOpen,
    toggle,
    skills,
    setSkills,
    levels,
    setLevels,
    bookAvailable,
    setBookAvailable,
    sortBook,
    setSortBook,
  } = props;
  const [saveSkills, setSaveSkills] = useState<BookSkills[]>([]);
  const [saveLevels, setSaveLevels] = useState<BookLevel[]>([]);
  const [saveAvailable, setSaveAvailable] = useState<boolean>(true);
  const [saveSortBook, setSaveSortBook] = useState<string>("By Title");

  const skillsList = Object.values(BookSkills);
  const levelsList = Object.values(BookLevel);
  const sortOptions = ["Date Added", "By Title", "By Author"];

  const handleSkillsChange = (event: CustomChangeEvent<BookSkills[]>) => {
    setSaveSkills(event.target.value);
  };

  const handleLevelsChange = (event: CustomChangeEvent<BookLevel[]>) => {
    setSaveLevels(event.target.value);
  };

  const handleSortChange = (sorting: string) => {
    setSaveSortBook(sorting);
  };

  const reset = () => {
    setSaveSkills([]);
    setSaveLevels([]);
    setSaveAvailable(true);
    setSaveSortBook("By Title");
  };

  const exit = () => {
    setSaveSkills(skills);
    setSaveLevels(levels);
    if (bookAvailable) setSaveAvailable(bookAvailable);
    setSaveSortBook(sortBook);
    toggle();
  };

  const submit = () => {
    setSkills(saveSkills);
    setLevels(saveLevels);
    setSortBook(saveSortBook);
    if (saveAvailable != null && setBookAvailable != null)
      setBookAvailable(saveAvailable);
    toggle();
  };

  return (
    <div className="App">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
            {/* title and x button */}
            <div className="grid grid-cols-2 gap-4">
              <h1 className="text-black text-xl font-semibold mt-4 ml-4 font-[family-name:var(--font-rubik)]">
                Filters
              </h1>
              <div className="flex justify-end items-center h-full">
                <button
                  onClick={exit}
                  className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p className="ml-4 text-slate-400 text-sm font-[family-name:var(--font-rubik)]">
              Select filter to apply
            </p>
            <hr className="h-px mx-4 my-3 bg-gray-200 border-0 dark:bg-gray-700" />

            <h2 className="text-black text-l font-semibold ml-4 mb-3">
              Sort By
            </h2>
            <div className="flex flex-wrap gap-2 ml-4">
              {sortOptions.map((option) => (
                <TagButton
                  key={option}
                  label={option}
                  onClick={() => handleSortChange(option)}
                  isSelected={option === saveSortBook}
                />
              ))}
            </div>
            <hr className="h-px mx-4 my-3 bg-gray-200 border-0 dark:bg-gray-700" />

            <h2 className="text-black text-l font-semibold ml-4 mb-3 ">
              Availability
            </h2>
            <div className="flex flex-wrap gap-2 ml-4">
              {/* <MultiSelectTagButton
                name="status"
                label="Available"
                value={saveStatus}
                onSelect={handleStatusChange}
              /> */}

              <TagButton
                label={"Available"}
                isSelected={saveAvailable}
                onClick={() => setSaveAvailable(!saveAvailable)}
              />
            </div>
            <hr className="h-px mx-4 my-3 bg-gray-200 border-0 dark:bg-gray-700" />

            <h2 className="text-black text-l font-semibold mb-2 ml-4">Level</h2>
            <div className="flex flex-wrap gap-2 ml-4">
              {levelsList.map((level) => (
                <MultiSelectTagButton
                  key={level}
                  name="levels"
                  label={level}
                  value={saveLevels}
                  onSelect={handleLevelsChange}
                />
              ))}
            </div>
            <hr className="h-px ml-4 my-3 mr-4 bg-gray-200 border-0 dark:bg-gray-700" />

            <h2 className="text-black text-l font-semibold ml-4 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 ml-4">
              {skillsList.map((skill) => (
                <MultiSelectTagButton
                  key={skill}
                  name="skills"
                  label={skill}
                  value={saveSkills}
                  onSelect={handleSkillsChange}
                />
              ))}
            </div>
            <hr className="h-px mx-4 my-3 bg-gray-200 border-0 dark:bg-gray-700" />

            <div className="grid grid-cols-2 gap-4 mx-4">
              <CommonButton label="Reset" onClick={reset} />

              <CommonButton
                onClick={submit}
                label={"Show results"}
                altStyle="bg-blue-900"
                altTextStyle="text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopup;
