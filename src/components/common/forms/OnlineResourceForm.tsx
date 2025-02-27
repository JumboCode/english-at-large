"use client";
import {
  OnlineResource,
  BookLevel,
  ResourceTopic,
  ResourceFormat,
  BookSkills,
} from "@prisma/client";
import CommonButton from "../button/CommonButton";
import { useState } from "react";
import { CustomChangeEvent, newEmptyResource } from "@/lib/util/types";
import { createResource, updateResource } from "@/lib/api/resources";
import MultiSelectTagButton from "./MultiSelectTagButton";
import {
  ConfirmPopupTypes,
  ConfirmPopupActions,
} from "@/lib/context/ConfirmPopupContext";
// import axios from "axios";
import { usePopup } from "@/lib/context/ConfirmPopupContext";

interface OnlineResourceFormProps {
  exit: () => void;
  existingResource?: OnlineResource | null;
  onSave?: (arg0: OnlineResource | null) => void;
}

const OnlineResourceForm = (props: OnlineResourceFormProps) => {
  const { exit, existingResource, onSave } = props;

  const levels = Object.values(BookLevel);
  const topic = Object.values(ResourceTopic);
  const format = Object.values(ResourceFormat);
  const skills = Object.values(BookSkills);

  const [newResource, setNewResource] =
    useState<Omit<OnlineResource, "id">>(newEmptyResource);
  const [editResource, setEditResource] = useState<
    OnlineResource | null | undefined
  >(existingResource);

  const { setConfirmPopup } = usePopup();

  // handles the setState for all HTML input fields
  const resourceChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (existingResource) {
      setEditResource(
        (prevResource) =>
          ({
            ...prevResource,
            [name]: value,
          } as OnlineResource)
      );
    } else if (newResource) {
      setNewResource(
        (prevResource) =>
          ({
            ...prevResource,
            [name]: value,
          } as Omit<OnlineResource, "id">)
      );
    }
  };

  // handles the setState for custom form fields
  const resourceSkillsChangeHandler = (e: CustomChangeEvent<BookSkills[]>) => {
    const { name, value } = e.target;
    if (existingResource) {
      setEditResource(
        (prevResource) =>
          ({
            ...prevResource,
            [name]: value,
          } as OnlineResource)
      );
    } else {
      setNewResource(
        (prevResource) =>
          ({
            ...prevResource,
            [name]: value,
          } as Omit<OnlineResource, "id">)
      );
    }
  };

  // dummy function - needs backend work
  const handleSave = async () => {
    try {
      if (editResource) {
        const editedResource = await updateResource(editResource);

        setConfirmPopup({
          type: ConfirmPopupTypes.RESOURCE,
          action: ConfirmPopupActions.ADD,
          success: !!editedResource,
        });

        if (editedResource && onSave) {
          onSave(editedResource);
        }
      } else if (newResource) {
        const createdResource = await createResource(newResource);

        setConfirmPopup({
          type: ConfirmPopupTypes.RESOURCE,
          action: ConfirmPopupActions.ADD,
          success: !!createdResource,
        });

        if (createdResource && onSave) {
          onSave(createdResource);
        }
      }
      exit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white text-black absolute left-0 top-0 w-full h-full overflow-scroll block text-sm font-medium">
      <form
        className="flex flex-col space-y-4 [&_input]:p-2 [&_textarea]:p-2 [&_select]:p-2"
        id="create-book-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <div className="flex justify-between px-[50px] py-5">
            <div>
              <h1 className="semi-bold text-3xl inline">
                {existingResource
                  ? "Edit Resource"
                  : "Add a new online resource"}
              </h1>
            </div>
            <div className="flex space-x-5">
              <CommonButton
                label="Cancel"
                onClick={() => {
                  exit();
                }}
              />
              <CommonButton
                label={existingResource ? "Save" : "Add Resource"}
                onClick={handleSave}
                altTextStyle="text-white"
                altStyle="bg-dark-blue"
              />
            </div>
          </div>
          <div className="mx-[50px] h-[0.3px] bg-black"></div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="name"
            className="block text-lg ml-[5%] semi-bold mb-2"
          >
            Resource name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="text-black border border-medium-grey-border p-5 rounded-lg border-solid w-[90%] mx-auto block h-9 font-normal"
            onChange={resourceChangeHandler}
            value={editResource ? editResource.name : newResource.name}
            required
          />
        </div>
        <div>
          <label
            htmlFor="link"
            className="block text-lg ml-[5%] semi-bold mb-2"
          >
            Link to resource
          </label>
          <input
            type="text"
            id="link"
            name="link"
            className="text-black border border-medium-grey-border p-5 rounded-lg border-solid w-[90%] mx-auto block h-9 font-normal"
            onChange={resourceChangeHandler}
            defaultValue={editResource ? editResource.link : ""}
            required
          />
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[100%]">
            <label htmlFor="level" className="text-lg semi-bold mb-2">
              Level
            </label>
            <select
              id="level"
              name="level"
              className="border-[1px] border-medium-grey-border border-solid rounded-lg block h-9 font-normal w-full mx-auto"
              onChange={resourceChangeHandler}
              defaultValue={editResource ? editResource.level : ""}
              required
            >
              <option value="">Select level</option>
              {levels.map((ResourceLevel, index) => {
                return (
                  <option key={index} value={ResourceLevel}>
                    {ResourceLevel.replace("_", " ")}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[100%]">
            <label htmlFor="topic" className="text-lg semi-bold mb-2">
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              className="border-[1px] border-medium-grey-border border-solid rounded-lg block h-9 font-normal w-full mx-auto"
              onChange={resourceChangeHandler}
              defaultValue={editResource ? editResource.topic : ""}
              required
            >
              <option value="">Select topic</option>
              {topic.map((topic, index) => {
                return (
                  <option key={index} value={topic}>
                    {topic}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[100%]">
            <label htmlFor="level" className="text-lg semi-bold mb-2">
              Format
            </label>
            <select
              id="format"
              name="format"
              className="border-[1px] border-medium-grey-border border-solid rounded-lg block h-9 font-normal w-full mx-auto"
              onChange={resourceChangeHandler}
              defaultValue={editResource ? editResource.format : ""}
              required
            >
              <option value="">Select format</option>
              {format.map((format, index) => {
                return (
                  <option key={index} value={format}>
                    {format.replace("_", " ")}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <p className="block text-lg ml-[5%] semi-bold mb-2">Skills</p>
          <div className="flex space-x-4 mx-[5%] font-normal">
            {skills.map((bookSkill, index) => {
              return (
                <MultiSelectTagButton<BookSkills>
                  key={index}
                  label={bookSkill}
                  value={
                    editResource
                      ? editResource.skills
                      : newResource
                      ? newResource.skills
                      : []
                  }
                  onSelect={resourceSkillsChangeHandler}
                  name={"skills"}
                />
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnlineResourceForm;
