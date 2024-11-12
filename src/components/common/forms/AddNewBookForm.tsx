"use client";
import { BookSkills, BookLevel, BookType, Book } from "@prisma/client";
import CommonButton from "../button/CommonButton";
import { useState } from "react";
import { CustomChangeEvent, newEmptyBook } from "@/lib/util/types";
import { createBook } from "@/lib/api/books";
import MultiSelectTagButton from "./MultiSelectTagButton";
import axios from 'axios';

interface addNewBookFormProps {
  setShowBookForm: (arg0: boolean) => void;
}

const AddNewBookForm = (props: addNewBookFormProps) => {
  const { setShowBookForm } = props;

  const skills = Object.values(BookSkills);
  const levels = Object.values(BookLevel);
  const types = Object.values(BookType);

  const [newBook, setNewBook] = useState<Omit<Book, "id">>(newEmptyBook);

  // handles the setState for all HTML input fields
  const bookChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(name);
    setNewBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  // handles the setState for custom form fields
  const bookSkillsChangeHandler = (e: CustomChangeEvent<BookSkills[]>) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const pullISBN = async() => {
    setShowBookForm(true);
    try {
    const response = await axios.get(`https://openlibrary.org/isbn/${newBook.isbn}.json`);
    
    if(response.data.title){
      const title = response.data.title;
      setNewBook((prevBook) => ({
        ...prevBook,
        title: title,
      }));
    }
    if(response.data.description){
      const desc = response.data.description.value;
      setNewBook((prevBook) => ({
        ...prevBook,
        description: desc,
      }));
    }
    if(response.data.publishers){
      const publisher = response.data.publishers[0];
      setNewBook((prevBook) => ({
        ...prevBook,
        publisher: publisher,
      }));
    }
    if(response.data.number_of_pages){
      const numPages : number = response.data.number_of_pages;
      setNewBook((prevBook) => ({
        ...prevBook,
        numPages: numPages,
      }));
    }
    } catch {
      throw new Error("Book not found for this ISBN")
    }
  }

  const addNewBook = async () => {
    try {
      console.log("CREATING BOOK");
      const createdBook = await createBook(newBook);
      console.log("CREATED BOOK");
      if (createdBook) {
        setShowBookForm(false);
      } else {
        throw new Error("Failed to create book!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white text-black absolute left-0 top-0 w-full h-full overflow-scroll block text-sm font-medium">
      <form
        className="flex flex-col space-y-2 [&_input]:p-2 [&_textarea]:p-2 [&_select]:p-2"
        id="create-book-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <div className="flex justify-between p-5">
            <div>
              <h1 className="font-bold text-3xl inline">Add New Book</h1>
            </div>
            <div className="flex space-x-5">
              <CommonButton
                label="Cancel"
                onClick={() => {
                  setShowBookForm(false);
                }}
              />
              <CommonButton
                label="Add Book"
                onClick={(e) => {
                  e.preventDefault();
                  addNewBook();
                }}
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
            name="title"
            className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
            value={newBook.title}
            onChange={bookChangeHandler}
          />
        </div>
        <div>
          <label htmlFor="author" className="block text-lg ml-[5%] font-bold">
            Author(s)
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
            onChange={bookChangeHandler}
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-lg ml-[5%] font-bold"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-15"
            value={newBook.description}
            onChange={bookChangeHandler}
          ></textarea>
        </div>
        <div>
          <label htmlFor="isbn" className="block text-lg ml-[5%] font-bold">
            ISBN Number
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
            onChange={bookChangeHandler}
          />
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%]">
            <label htmlFor="publisher" className="text-lg font-bold">
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              className="border-[1px] border-black border-solid rounded-lg h-8"
              value={newBook.publisher}
              onChange={bookChangeHandler}
            />
          </div>
          <div className="flex flex-col w-[50%]">
            <label htmlFor="releaseDate" className="text-lg font-bold">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              className="border-[1px] border-black border-solid rounded-lg block h-8"
              onChange={bookChangeHandler}
            />
          </div>
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%]">
            <label htmlFor="level" className="text-lg font-bold">
              Level
            </label>
            <select
              id="level"
              name="level"
              className="border-[1px] border-black border-solid rounded-lg block h-8"
              onChange={bookChangeHandler}
            >
              <option value="">Select level</option>
              {levels.map((bookLevel, index) => {
                return (
                  <option key={index} value={bookLevel}>
                    {bookLevel.replace("_", " ")}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col w-[50%]">
            <label htmlFor="bookType" className="text-lg font-bold">
              Type
            </label>
            <select
              id="bookType"
              name="bookType"
              className="border-[1px] border-black border-solid rounded-lg block h-8"
              onChange={bookChangeHandler}
            >
              <option value="">Select book type</option>
              {types.map((bookType, index) => {
                return (
                  <option key={index} value={bookType}>
                    {bookType.replace("_", " ")}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%]">
            <label htmlFor="publisher" className="text-lg font-bold">
              Page Numbers
            </label>
            <input
              type="number"
              id="numPages"
              name="numPages"
              className="border-[1px] border-black border-solid rounded-lg h-8"
              value={newBook.numPages || ""}
              onChange={bookChangeHandler}
            />
          </div>
        </div>
        <div>
          <p className="block text-lg ml-[5%] font-bold">Skills</p>
          <div className="flex space-x-4 mx-[5%]">
            {skills.map((bookSkill, index) => {
              return (
                <MultiSelectTagButton<BookSkills>
                  key={index}
                  label={bookSkill}
                  value={newBook.skills}
                  onSelect={bookSkillsChangeHandler}
                  name={"skills"}
                />
              );
            })}
          </div>
          <CommonButton 
              label={"ISBN Click"} 
              onClick={() => {
                pullISBN();
              }}/>
        </div>
      </form>
    </div>
  );
};

export default AddNewBookForm;
