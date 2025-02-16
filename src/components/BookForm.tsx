"use client";
import { BookSkills, BookLevel, BookType, Book } from "@prisma/client";
import CommonButton from "./common/button/CommonButton";
import { useCallback, useEffect, useState } from "react";
import { CustomChangeEvent, newEmptyBook } from "@/lib/util/types";
import {
  createBook,
  getBookCover,
  updateBook,
  getAllBooks,
} from "@/lib/api/books";
import MultiSelectTagButton from "./common/forms/MultiSelectTagButton";
import {
  ConfirmPopupTypes,
  ConfirmPopupActions,
} from "@/lib/context/ConfirmPopupContext";
import axios from "axios";
import { usePopup } from "@/lib/context/ConfirmPopupContext";

interface BookFormProps {
  exit: () => void;
  existingBook?: Book | null;
  onSave?: (arg0: Book | null) => void;
  isbn?: string;
}

const BookForm = (props: BookFormProps) => {
  const { exit, existingBook, onSave, isbn } = props;

  const skills = Object.values(BookSkills);
  const levels = Object.values(BookLevel);
  const types = Object.values(BookType);

  const [newBook, setNewBook] = useState<Omit<Book, "id">>(newEmptyBook);
  const [editBook, setEditBook] = useState<Book | null | undefined>(
    existingBook
  );
  const [foundSimilar, setFoundSimilar] = useState(false);

  const { setConfirmPopup } = usePopup();

  const addToISBN = (isbn: string, updateBook: Omit<Book, "id">) => {
    console.log("THIS IS THE ISBN", isbn);
    if (updateBook.isbn.length === 0) {
      updateBook.isbn = [isbn];
    } else {
      updateBook.isbn.push(isbn);
    }
  };

  const pullISBN = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/isbn/${isbn ?? newBook.isbn}.json`
      );
      const data = response.data;

      // Create an object to map OpenLibrary keys to book keys
      const bookFields = {
        title: data.title,
        description: data.description?.value,
        publisher: data.publishers?.[0],
        numPages: data.number_of_pages,
      };

      // Update newBook with retrieved data
      setNewBook((prevBook) => {
        const updatedBook = { ...prevBook };

        // update all fields at once
        if (bookFields.title) updatedBook.title = bookFields.title;
        if (bookFields.description)
          updatedBook.description = bookFields.description;
        if (bookFields.publisher) updatedBook.publisher = bookFields.publisher;
        if (bookFields.numPages) updatedBook.numPages = bookFields.numPages;
        updatedBook.copies = 1;
        updatedBook.availableCopies = 1;
        //for now set copies and availCopies to 1, need to go back in the future and check
        if (isbn) addToISBN(isbn, updatedBook);
        console.log("look here now", updatedBook.isbn);

        return updatedBook;
      });
      // Book cover retrieval
      const coverUrl = await getBookCover(isbn ?? newBook.isbn[0]);
      console.log(coverUrl);
      setNewBook((prevBook) => ({
        ...prevBook,
        coverURL:
          coverUrl ??
          "https://covers.openlibrary.org/b/isbn/978-1-933624-43-3-M.jpg",
      }));
    } catch {
      throw new Error("Book not found for this ISBN");
    }
  }, [isbn, newBook.isbn]);

  useEffect(() => {
    pullISBN();
  }, [isbn, pullISBN]);

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

  const findSimilar = (allBooks: Book[], title: string) => {
    return allBooks.filter(
      (book) =>
        book.title === title ||
        book.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(book.title.toLowerCase())
    );
  };
  const handleSave = async () => {
    try {
      if (editBook) {
        const editedBook = await updateBook(editBook);

        setConfirmPopup({
          type: ConfirmPopupTypes.BOOK,
          action: ConfirmPopupActions.ADD,
          success: !!editedBook,
        });

        if (editedBook && onSave) {
          onSave(editedBook);
        }
      } else if (newBook) {
        const allBooks = await getAllBooks();
        //checks if any similar books are returned, but should also ask the user
        const similarBooks = findSimilar(allBooks!, newBook.title);
        console.log("look here", newBook, similarBooks);
        if (similarBooks.length != 0) {
          //for now just pick the first matching title
          similarBooks[0].isbn.push(newBook.isbn[0]);
          similarBooks[0].copies += 1;
          similarBooks[0].availableCopies += 1;
          setFoundSimilar(true);
          //we can create a modal from this
          console.log(foundSimilar);
          const updatedBook = await updateBook(similarBooks[0]);

          setConfirmPopup({
            type: ConfirmPopupTypes.EXISTING_BOOK,
            action: ConfirmPopupActions.ADD,
            success: !!updatedBook,
          });

          if (updatedBook && onSave) {
            onSave(updatedBook);
          }
        } else {
          const createdBook = await createBook(newBook);

          setConfirmPopup({
            type: ConfirmPopupTypes.BOOK,
            action: ConfirmPopupActions.ADD,
            success: !!createdBook,
          });

          if (createdBook && onSave) {
            onSave(createdBook);
          }
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
              <h1 className="font-semibold text-3xl inline">
                {existingBook ? "Edit Book" : "Add a new book"}
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
                label={existingBook ? "Save" : "Add Book"}
                onClick={handleSave}
                altTextStyle="text-white"
                altStyle="bg-dark-blue"
              />
            </div>
          </div>
          <div className="h-[0.3px] bg-black"></div>
        </div>
        {isbn ? (
          <div>
            <label htmlFor="isbn" className="block text-lg ml-[5%]">
              ISBN Number
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              className="text-black border border-medium-grey-border p-5 rounded-lg border-solid w-[90%] mx-auto block h-9 font-normal"
              onChange={bookChangeHandler}
              defaultValue={editBook ? editBook.isbn[0] : isbn}
              required
            />
          </div>
        ) : null}
        <div className="mt-4">
          <label htmlFor="title" className="block text-lg ml-[5%]">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="text-black border border-medium-grey-border p-5 rounded-lg border-solid w-[90%] mx-auto block h-9 font-normal"
            onChange={bookChangeHandler}
            value={editBook ? editBook.title : newBook.title}
            required
          />
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%]">
            <label htmlFor="author" className="text-lg">
              Author(s)
            </label>
            <input
              type="text"
              id="author"
              name="author"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-9 font-normal"
              onChange={bookChangeHandler}
              value={editBook ? editBook.author : newBook.author}
              required
            />
          </div>
          <div className="flex flex-col w-[50%]">
            <label htmlFor="publisher" className="text-lg">
              Publisher(s)
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-9 font-normal"
              onChange={bookChangeHandler}
              value={editBook ? editBook.publisher : newBook.publisher}
              required
            />
          </div>
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%]">
            <label htmlFor="releaseDate" className="text-lg">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-9 font-normal"
              onChange={bookChangeHandler}
              defaultValue={
                editBook && editBook.releaseDate ? editBook.releaseDate : ""
              }
            />
          </div>
          <div className="flex flex-col w-[50%]">
            <label htmlFor="pages" className="text-lg">
              No. of pages
            </label>
            <input
              type="number"
              id="numPages"
              name="numPages"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-9 font-normal"
              onChange={bookChangeHandler}
              value={
                editBook && editBook.numPages
                  ? editBook.numPages
                  : newBook.numPages ?? 1
              }
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-lg ml-[5%]">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="text-black border border-medium-grey-border p-5 rounded-lg border-solid w-[90%] mx-auto block h-15 font-normal"
            onChange={bookChangeHandler}
            value={editBook ? editBook.description : newBook.description}
            required
          ></textarea>
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%]">
            <label htmlFor="level" className="text-lg">
              Level
            </label>
            <select
              id="level"
              name="level"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-9 font-normal"
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
            <label htmlFor="bookType" className="text-lg">
              Type
            </label>
            <select
              id="bookType"
              name="bookType"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-9 font-normal"
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
          <p className="block text-lg ml-[5%]">Skills</p>
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

          {/* {!existingBook ? (
            <CommonButton
              label={"ISBN Click"}
              onClick={() => {
                pullISBN();
              }}
            />
          ) : null} */}
        </div>
      </form>
    </div>
  );
};

export default BookForm;
