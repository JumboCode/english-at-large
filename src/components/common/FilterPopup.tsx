"use client";
import { BookSkills, BookLevel } from "@prisma/client";

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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-black text-xl font-semibold mb-4">Skills</h2>

            <ul>
              {skillsList.map((bookSkill, index) => {
                return (<li key={index}>
                  { skills.includes(bookSkill.replace("_", " ")) ? (
                    <button onClick={() => removeSkill(bookSkill.replace("_", " "))} className="bg-black text-white px-4 py-2 rounded border">
                      {bookSkill.replace("_", " ")}
                    </button>
                  ) : (
                    <button onClick={() => addSkill(bookSkill.replace("_", " "))} className="bg-white-500 text-black px-4 py-2 rounded border">
                      {bookSkill.replace("_", " ")}
                    </button>
                  )}
                </li>);
              })}
            </ul>
            
            <h2 className="text-black text-xl font-semibold mb-4">Level</h2>
            <ul>
              {levelsList.map((levelSkill, index) => {
                return (<li key={index}>
                  { levels.includes(levelSkill.replace("_", " ")) ? (
                    <button onClick={() => removeLevel(levelSkill.replace("_", " "))} className="bg-black text-white px-4 py-2 rounded border">
                      {levelSkill.replace("_", " ")}
                    </button>
                  ) : (
                    <button onClick={() => addLevel(levelSkill.replace("_", " "))} className="bg-white-500 text-black px-4 py-2 rounded border">
                      {levelSkill.replace("_", " ")}
                    </button>
                  )}
                </li>);
              })}
            </ul>



      
            <button onClick={toggle} className="bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPopup;