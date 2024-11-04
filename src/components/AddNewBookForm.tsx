"use client";
import { BookSkills, BookLevel, BookType, BookStatus } from "@prisma/client";
import CommonButton from "./common/button/CommonButton";
import { useState } from "react";
import Tag from "./common/button/Tag";
import { release } from "os";
import { createBook } from "@/lib/api/books";
// import { createBook } from "@/lib/api/books";
interface addNewBookFormProps {
  setShowBookForm: (arg0: boolean) => void;
}

const AddNewBookForm = (props: addNewBookFormProps) => {

  /* export const newEmptyBook: Omit<Book, "id"> = {
  title: "Untitled Book",
  author: "",
  isbn: "000-0-00-000000-0",
  publisher: "",
  level: BookLevel.Beginner,
  booktype: BookType.Reference,
  scanLink: "http://example.com/scan",
  description: "",
  notes: "",
  status: BookStatus.Available,
  skills: [],
  releaseDate: null,
}; */

  const {setShowBookForm} = props;

  const skills = Object.values(BookSkills);
  const levels = Object.values(BookLevel);
  // const status = Object.values(BookStatus);
  const types = Object.values(BookType);

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [publisher, setPublisher] = useState<string>(""); 
  const [releaseDate, setReleaseDate] = useState<string>(""); 
  const [level, setLevel] = useState<string>("");
  const [bookType, setBookType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // const [status, setStatus] = useState<string>("");
  const [skillArray, setSkillArray] = useState<BookSkills[]>([]);

  const addNewBook = async () => {
    const bookPayload = {
      title: title,
      author: author,
      isbn: isbn,
      publisher: publisher,
      releaseDate: releaseDate,
      level: level,
      booktype: bookType,
      description: description,
      status: "Available",
      skills: skillArray
    }

    try {
      await createBook(bookPayload)
    } catch (error) {
      console.error(error)
    }
  };

  return (
      <div className="bg-white text-black absolute left-0 top-0 w-full h-full overflow-scroll block text-sm font-medium">
        <form className="flex flex-col space-y-2 [&_input]:p-2 [&_textarea]:p-2 [&_select]:p-2" id="create-book-form">
          <div>
            <div className="flex inline justify-between p-5">
              <div>
                <h1 className="font-bold text-3xl inline">Add New Book</h1>
              </div>
              <div className="flex inline space-x-5">
                <CommonButton
                  label="Cancel"
                  onClick={() => {setShowBookForm(false)}}
                />
                <CommonButton
                  label="Add Book"
                  onClick={e => {e.preventDefault(); addNewBook()}}
                  altTextStyle="text-white"
                  altStyle="bg-dark-blue"
                />
              </div>
            </div>
            <div className="mx-3 h-[0.5px] bg-black"></div>
          </div>
          <div className="mt-4">
            <label htmlFor="title" className="block text-lg ml-[5%] font-bold">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-lg ml-[5%] font-bold">
              Author(s)
            </label>
            <input
              type="text"
              id="author"
              className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
              onChange={(event) => {
                setAuthor(event.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg ml-[5%] font-bold">
              Description
            </label>
            <textarea
              id="description"
              className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-15"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            ></textarea>
          </div>
          <div>
          <label htmlFor="ISBN " className="block text-lg ml-[5%] font-bold">
              ISBN Number
            </label>
            <input
              type="text"
              id="ISBN"
              className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
              onChange={(event) => {
                setIsbn(event.target.value);
              }}
            />
          </div>
          <div className="flex inline w-[90%] mx-auto space-x-4">
            <div className="flex flex-col w-[50%]">
              <label htmlFor="publisher" className="text-lg font-bold">
                Publisher
              </label>
              <input
                type="text"
                id="publisher"
                className="border-[1px] border-black border-solid rounded-lg h-8"
                onChange={(event) => {
                  setPublisher(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-col w-[50%]">
              <label htmlFor="releaseDate" className="text-lg font-bold">
                Release Date
              </label>
              <input
                type="text"
                id="releaseDate"
                className="border-[1px] border-black border-solid rounded-lg block h-8"
                onChange={(event) => {
                  setReleaseDate(event.target.value);
                }}
              />
            </div>
          </div>
          {/* <div>
            <select
              name="type"
              className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
            >
              <option value="">Select Book Status</option>
              {status.map((stat, index) => {
                return <option key={index}>{stat.replace("_", " ")}</option>;
              })}
            </select>
          </div> */}
          <div className="flex inline w-[90%] mx-auto space-x-4">
            <div className="flex flex-col w-[50%]">
              <label htmlFor="level" className="text-lg font-bold">
                Level
              </label>
              <select
                id="level"
                name="level"
                className="border-[1px] border-black border-solid rounded-lg block h-8"
                onChange={(event) => {
                  setLevel(event.target.value);
                }}
              >
                <option value="">Select level</option>
                {levels.map((bookLevel, index) => {
                  return <option key={index} value={bookLevel}>{bookLevel.replace("_", " ")}</option>;
                })}
                
              </select>
            </div>
            <div className="flex flex-col w-[50%]">
              <label htmlFor="type" className="text-lg font-bold">
                Type
              </label>
              <select
                id="type"
                name="type"
                className="border-[1px] border-black border-solid rounded-lg block h-8"
                onChange={(event) => {
                  setBookType(event.target.value);
                }}
              >
                <option value="">Select book type</option>
                {types.map((bookType, index) => {
                  return <option key={index} value={bookType}>{bookType.replace("_", " ")}</option>;
                })}
              </select>
            </div>
          </div>

          <div>
            <p className="block text-lg ml-[5%] font-bold">Skills</p>
            <div  className="flex space-x-4 mx-[5%]">
              {skills.map((bookSkill, index) => {
                return <Tag key={index} label={bookSkill} skillsArray={skillArray} isSelected={skillArray.includes(bookSkill)} setSkillsArray={setSkillArray}/>;
              })}
            </div>
          </div>
        </form>
      </div>
  );
};

export default AddNewBookForm;
