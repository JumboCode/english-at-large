"use client";
import { BookSkills, BookLevel } from "@prisma/client";
import Head from "next/head";

interface FilterPopupProps {
  isOpen: boolean
  toggle: () => void
  skills: string[]
  setSkills: (filter: string[]) => void
  levels: string[]
  setLevels: (level: string[]) => void
}

const FilterPopup = (props: FilterPopupProps) => {
  const { isOpen, toggle, skills, setSkills, levels, setLevels } = props;
  const skillsList = Object.values(BookSkills);
  const levelsList = Object.values(BookLevel);

  const addSkill = (filter: string) => {
    setSkills([...skills, filter]);
  }

  const removeSkill = (filter: string) => {
    setSkills(skills.filter(word => word != filter))
  }

  const addLevel = (level: string) => {
    setLevels([...levels, level]);
  }

  const removeLevel = (level: string) => {
    setLevels(levels.filter(word => word != level))
  }


  return (
    <div className="App">

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          
          <div onClick={toggle} className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">

            {/* title and x button */}
            <div className="grid grid-cols-2 gap-4">
              <h1 className="text-black text-xl font-semibold mt-4 ml-4">Filters</h1>
              <div className="flex justify-end items-center h-full">
                <button className="bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <p className="ml-4 text-slate-400 text-sm">select filter to apply</p>
            <hr className="h-px ml-4 my-3 mr-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

            <h2 className="text-black text-l font-semibold ml-4 mb-3 s">Sort By</h2>
            <div className = "flex flex-wrap gap-2 ml-4">
              <button className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center"> Date Added</button>
              <button className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center">By Title</button>
              <button className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center">By Author</button>
            </div>
            <hr className="h-px ml-4 my-3 mr-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

            <h2 className="text-black text-l font-semibold ml-4 mb-3 s">Availability</h2>
              <div className = "flex flex-wrap gap-2 ml-4">
                <button className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center"> Available Now</button>
              </div>
            <hr className="h-px ml-4 my-3 mr-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            
            <h2 className="text-black text-l font-semibold mb-2 ml-4 mb-3 s">Level</h2>
            <ul className="flex flex-wrap gap-2 ml-4">
              {levelsList.map((levelSkill, index) => {
                return (<li key={index}>
                  { levels.includes(levelSkill.replace("_", " ")) ? (
                    <button onClick={() => removeLevel(levelSkill.replace("_", " "))} className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center">
                      {levelSkill.replace("_", " ")}
                    </button>
                  ) : (
                    <button onClick={() => addLevel(levelSkill.replace("_", " "))} className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center">
                      {levelSkill.replace("_", " ")}
                    </button>
                  )}
                </li>);
              })}
            </ul>
            <hr className="h-px ml-4 my-3 mr-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            
            <h2 className="text-black text-l font-semibold ml-4 mb-3 s">Skills</h2>
            <ul className="flex flex-wrap gap-2 ml-4">
              {skillsList.map((bookSkill, index) => {
                return (<li key={index}>
                  { skills.includes(bookSkill.replace("_", " ")) ? (
                    <button onClick={() => removeSkill(bookSkill.replace("_", " "))} className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center">
                      {bookSkill.replace("_", " ")}
                    </button>
                  ) : (
                    <button onClick={() => addSkill(bookSkill.replace("_", " "))} className="bg-white-200 text-black-800 px-4 py-2 rounded-full shadow-sm border border-gray-300 items-center">
                      {bookSkill.replace("_", " ")}
                    </button>
                  )}
                </li>);
              })}
            </ul>
            <hr className="h-px ml-4 my-3 mr-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white-200 text-blue-800 px-4 py-2 rounded-md shadow-sm border border-blue-900 text-center ml-4">
                Reset
              </div>
              <div className="bg-blue-900 text-white px-4 py-2 rounded-md shadow-sm border border-blue-900 text-center mr-4">
                Show results
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPopup;