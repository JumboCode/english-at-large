"use client";
import {
  Book,
  BookSkills,
  BookLevel,
  BookStatus,
  BookType,
} from "@prisma/client";

import { useState } from "react";
import { updateBook } from "@/lib/api/books";
import CommonButton from "./common/button/CommonButton";
import Tag from "./tag";
import { useRouter } from "next/navigation";

interface EditProps {
  book: Book;
}

interface SignupFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  publisher: string;
  level: BookLevel;
  booktype: BookType;
  skills: BookSkills[];
  releaseDate: string;
  status: BookStatus;
}

const EditBookForm = (props: EditProps) => {
  const skills = Object.values(BookSkills);
  const levels = Object.values(BookLevel);
  const types = Object.values(BookType);

  const book = props.book;
  if (!book.releaseDate) {
    book.releaseDate = "";
  }

  const [formData, setFormData] = useState<SignupFormData>({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    description: book.description,
    publisher: book.publisher,
    level: book.level,
    booktype: book.booktype,
    skills: book.skills,
    releaseDate: book.releaseDate || "",
    status: book.status,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    const newBook = {
      id: book.id,
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      description: formData.description,
      publisher: formData.publisher,
      level: formData.level,
      booktype: formData.booktype,
      skills: formData.skills,
      releaseDate: formData.releaseDate,
      scanLink: book.scanLink,
      notes: book.notes,
      status: formData.status,
    };

    await updateBook(newBook);
  };
  const router = useRouter();
  const handleCancel = () => {
    router.push("/books/" + book.id);
  };

  return (
    <div className="bg-white text-black absolute left-0 top-0 w-full h-full overflow-scroll block text-sm font-medium">
      <form
        className="flex flex-col space-y-2 [&_input]:p-2 [&_textarea]:p-2 [&_select]:p-2"
        id="create-book-form"
        onSubmit={handleSave}
      >
        <div>
          <div className="flex inline justify-between p-5">
            <div>
              <h1 className="font-bold text-3xl inline">Edit Book</h1>
            </div>
            <div className="flex inline space-x-5">
              <CommonButton label="Cancel" onClick={handleCancel} />
              <button
                type="submit"
                className="flex justify-self-center items-center px-3.5 py-3 min-w-max border rounded-lg border-dark-blue bg-[#202D74] hover:bg-[#202D74]/80 text-white text-base font-bold group-invalid:pointer-events-none group-invalid:opacity-30 disabled:pointer-events-none disabled:opacity-30"
              >
                Save
              </button>
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
            defaultValue={book.title}
            onChange={handleInputChange}
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
            className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
            defaultValue={book.author}
            onChange={handleInputChange}
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
            className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-15"
            defaultValue={book.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="ISBN " className="block text-lg ml-[5%] font-bold">
            ISBN
          </label>
          <input
            type="text"
            id="ISBN"
            className="border-[1px] border-black border-solid rounded-lg w-[90%] mx-auto block h-8"
            defaultValue={book.isbn}
            onChange={handleInputChange}
            required
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
              defaultValue={book.publisher}
              onChange={handleInputChange}
              required
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
              defaultValue={book.releaseDate}
              onChange={handleInputChange}
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
              value={book.level}
              onChange={handleInputChange}
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
            <label htmlFor="type" className="text-lg font-bold">
              Type
            </label>
            <select
              id="type"
              name="type"
              className="border-[1px] border-black border-solid rounded-lg block h-8"
              value={book.booktype}
              onChange={handleInputChange}
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
                <Tag
                  key={index}
                  label={bookSkill}
                  // skillsArray={book.skills}
                  // isSelected={book.skills.includes(bookSkill)}
                  // setSkillsArray={setSkillArray}
                />
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
