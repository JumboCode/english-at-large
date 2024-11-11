"use client";
import { BookSkills, BookLevel, BookType, Book } from "@prisma/client";
import CommonButton from "../button/CommonButton";
import { useState } from "react";
import { CustomChangeEvent, newEmptyBook } from "@/lib/util/types";
import { createBook, updateBook } from "@/lib/api/books";
import MultiSelectTagButton from "./MultiSelectTagButton";

interface BookFormProps {
  setShowBookForm: (arg0: boolean) => void;
  existingBook?: Book | null;
  onSave?: (arg0: Book | null) => void;
}

const BookForm = (props: BookFormProps) => {
  const { setShowBookForm, existingBook, onSave } = props;

  const skills = Object.values(BookSkills);
  const levels = Object.values(BookLevel);
  const types = Object.values(BookType);

  const [newBook, setNewBook] = useState<Omit<Book, "id">>(newEmptyBook);
  const [editBook, setEditBook] = useState<Book | null | undefined>(
    existingBook
  );

  // handles the setState for all HTML input fields
  const bookChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (existingBook) {
      setEditBook(
        (prevBook) =>
          ({
            ...prevBook,
            [name]: value,
          } as Book)
      );
    } else if (newBook) {
      setNewBook(
        (prevBook) =>
          ({
            ...prevBook,
            [name]: value,
          } as Omit<Book, "id">)
      );
    }
  };

  // handles the setState for custom form fields
  const bookSkillsChangeHandler = (e: CustomChangeEvent<BookSkills[]>) => {
    const { name, value } = e.target;
    if (existingBook) {
      setEditBook(
        (prevBook) =>
          ({
            ...prevBook,
            [name]: value,
          } as Book)
      );
    } else {
      setNewBook(
        (prevBook) =>
          ({
            ...prevBook,
            [name]: value,
          } as Omit<Book, "id">)
      );
    }
  };

  const handleSave = async () => {
    try {
      if (editBook) {
        const editedBook = await updateBook(editBook);
        if (editedBook) {
          if (onSave) {
            onSave(editedBook);
          }
          setShowBookForm(false);
        } else {
          throw new Error("Failed to update book!");
        }
      } else if (newBook) {
        const createdBook = await createBook(newBook);
        if (createdBook) {
          if (onSave) {
            onSave(createdBook);
          }
          setShowBookForm(false);
        } else {
          throw new Error("Failed to create book!");
        }
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
      >
        <div>
          <div className="flex justify-between p-5">
            <div>
              <h1 className="font-bold text-3xl inline">
                {existingBook ? "Edit Book" : "Add New Book"}
              </h1>
            </div>
            <div className="flex space-x-5">
              <CommonButton
                label="Cancel"
                onClick={() => {
                  setShowBookForm(false);
                }}
              />
              <CommonButton
                label={existingBook ? "Save" : "Add Book"}
                onClick={handleSave}
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
            onChange={bookChangeHandler}
            defaultValue={editBook ? editBook.title : ""}
            required
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
            defaultValue={editBook ? editBook.author : ""}
            required
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
            onChange={bookChangeHandler}
            defaultValue={editBook ? editBook.description : ""}
            required
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
            defaultValue={editBook ? editBook.isbn : ""}
            required
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
              onChange={bookChangeHandler}
              defaultValue={editBook ? editBook.publisher : ""}
              required
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
              defaultValue={
                editBook && editBook.releaseDate ? editBook.releaseDate : ""
              }
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
              defaultValue={editBook ? editBook.level : ""}
              required
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
              defaultValue={editBook ? editBook.bookType : ""}
              required
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

        <div>
          <p className="block text-lg ml-[5%] font-bold">Skills</p>
          <div className="flex space-x-4 mx-[5%]">
            {skills.map((bookSkill, index) => {
              return (
                <MultiSelectTagButton<BookSkills>
                  key={index}
                  label={bookSkill}
                  value={
                    editBook ? editBook.skills : newBook ? newBook.skills : []
                  }
                  onSelect={bookSkillsChangeHandler}
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

export default BookForm;
