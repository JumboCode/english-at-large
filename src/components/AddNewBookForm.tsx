"use client";
import { BookSkills, BookLevel, BookStatus, BookType } from "@prisma/client";
import CommonButton from "./common/button/CommonButton";

const AddNewBookForm = ({showBookForm}) => {
  const skills = Object.values(BookSkills);
  const levels = Object.values(BookLevel);
  const status = Object.values(BookStatus);
  const types = Object.values(BookType);

  return (
      <div className="bg-white text-black absolute left-0 top-0 w-full h-full overflow-scroll block text-sm font-medium">
        <form className="flex flex-col" id="create-book-form">
          <div>
            <h1 className="font-bold text-3xl inline">Add new Book</h1>
            <CommonButton
              label="Cancel"
              onClick={() => {showBookForm(false); }}
            />
            <CommonButton
              label="Add Book"
              onClick={() => {}}
              altTextStyle="text-white"
              altStyle="bg-dark-blue"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-lg">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="border-2 border-black border-solid rounded-md"
            />
            <label htmlFor="author" className="block text-lg">
              Author
            </label>
            <input
              type="text"
              id="author"
              className="border-2 border-black border-solid rounded-md"
            />
          </div>
          <div>
            <label htmlFor="ISBN " className="block text-lg">
              ISBN Number
            </label>
            <input
              type="text"
              id="ISBN"
              className="border-2 border-black border-solid rounded-md"
            />
            <select
              name="type"
              className="border-2 border-black border-solid rounded-md"
            >
              <option value="">Select Book Status</option>
              {status.map((stat, index) => {
                return <option key={index}>{stat.replace("_", " ")}</option>;
              })}
            </select>
          </div>
          <div>
            <select
              name="type"
              className="border-2 border-black border-solid rounded-md"
            >
              <option value="">Select Book Type</option>
              {types.map((bookType, index) => {
                return <option key={index}>{bookType.replace("_", " ")}</option>;
              })}
            </select>
          </div>
          <div>
            <label htmlFor="publisher" className="block text-lg ">
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              className="border-2 border-black border-solid rounded-md"
            />
            <label htmlFor="releaseDate" className="block text-lg ">
              Release Date
            </label>
            <input
              type="text"
              id="releaseDate"
              className="border-2 border-black border-solid rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg ">
              Description
            </label>
            <textarea
              id="description"
              className="border-2 border-black border-solid rounded-md"
            ></textarea>
          </div>
          <div>
            <select
              name="level"
              className="border-2 border-black border-solid rounded-md"
            >
              <option value="">Select Level</option>
              {levels.map((bookLevel, index) => {
                return <option key={index}>{bookLevel.replace("_", " ")}</option>;
              })}
            </select>
          </div>

          <div>
            <p>Skills</p>
            <ul>
              {skills.map((bookSkill, index) => {
                return <li key={index}>{bookSkill.replace("_", " ")}</li>;
              })}
            </ul>
          </div>
        </form>
      </div>
  );
};

export default AddNewBookForm;
