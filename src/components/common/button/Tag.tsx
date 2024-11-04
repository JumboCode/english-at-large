"use client"
import { BookSkills } from "@prisma/client";
import React from "react";

interface tagProps {
    label: BookSkills;
    skillsArray: BookSkills[];
    setSkillsArray: (arg0: BookSkills[]) => void;
    isSelected: boolean;
}

/**
 * Our internal Tag component.
 * @param props: label, selectedArray (if want to make an array of selected tags)
 * @returns a React Component.
 */

const Tag = (props: tagProps) => {
    const {label, skillsArray, setSkillsArray, isSelected} = props;

    const toggleSelected = () => {
        if (isSelected) {
            const newSkills: BookSkills[] = [];
            for (const i in skillsArray) {
                if (skillsArray[i] != label) {
                    newSkills.push(skillsArray[i])
                }
            }
            setSkillsArray(newSkills);
        } else {
            const newSkills: BookSkills[] = [...skillsArray, label];
            setSkillsArray(newSkills)
        }
    }

    return (
        <div>
            <div 
                className={"border-[1px] border-black p-2 rounded-full cursor-pointer select-none " + (isSelected ? "bg-blue-200" : null)}
                onClick={toggleSelected}
            >{label.replace("_", " ")}</div>
        </div>
    )
}

export default Tag;

