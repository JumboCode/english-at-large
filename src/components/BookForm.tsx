"use client";
import { BookSkills, BookLevel, BookType, Book } from "@prisma/client";
import CommonButton from "./common/button/CommonButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookWithRequests,
  CustomChangeEvent,
  getAvailableCopies,
  newEmptyBook,
} from "@/lib/util/types";
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
  exit: (arg0: boolean) => void;
  existingBook?: BookWithRequests | null;
  onSave?: (arg0: BookWithRequests | null) => void;
  isbn?: string;
  setOriginalBook?: (origBook: Omit<Book, "id">) => void;
  setBookList?: (bookList: BookWithRequests[]) => void;
}

const BookForm = (props: BookFormProps) => {
  const { exit, existingBook, onSave, isbn, setOriginalBook, setBookList } =
    props;

  const skills = Object.values(BookSkills);
  const levels = Object.values(BookLevel);
  const types = Object.values(BookType);

  const [newBook, setNewBook] = useState<Omit<Book, "id">>(newEmptyBook);
  const [editBook, setEditBook] = useState<BookWithRequests | null | undefined>(
    existingBook
  );
  const [numCopies, setNumCopies] = useState<number>(
    existingBook ? existingBook.copies : 1
  );
  const [numPages, setNumpages] = useState<string>(
    existingBook && existingBook.numPages ? String(existingBook.numPages) : "0"
  );
  const [availableCopies, setAvailableCopies] = useState<number>(
    existingBook ? getAvailableCopies(existingBook) : 1
  );
  const [isInvalidCopies, setisInvalidCopies] = useState<boolean>(false);

  const { setConfirmPopup } = usePopup();

  const addToISBN = (isbn: string, updateBook: Omit<Book, "id">) => {
    if (updateBook.isbn.length === 0) {
      updateBook.isbn = [isbn];
    } else {
      if (!updateBook.isbn.includes(isbn)) {
        updateBook.isbn.push(isbn);
      }
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
        //for now set copies and availCopies to 1, need to go back in the future and check
        if (isbn) addToISBN(isbn, updatedBook);
        return updatedBook;
      });
      // Book cover retrieval
      const coverUrl = await getBookCover(isbn ?? newBook.isbn[0]);
      setNewBook((prevBook) => ({
        ...prevBook,
        coverURL:
          coverUrl ??
          "https://covers.openlibrary.org/b/isbn/978-1-933624-43-3-M.jpg",
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setConfirmPopup({
        type: ConfirmPopupTypes.ISBN_ERROR,
        action: ConfirmPopupActions.NONE,
        success: false,
      });
    }
  }, [isbn, newBook.isbn, setConfirmPopup]);

  useEffect(() => {
    if (isbn && !newBook.isbn.includes(isbn)) {
      setNewBook((prev) => {
        const updated = { ...prev };
        addToISBN(isbn, updated);
        return updated;
      });
    }

    if (isbn) {
      pullISBN();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isbn]);

  const requiredFields = useMemo(() => {
    const bookToSave = existingBook ? editBook : newBook;
    const validLevel =
      bookToSave!.level !== null &&
      Object.values(BookLevel).includes(bookToSave!.level);
    const validBookType =
      bookToSave!.bookType !== null &&
      Object.values(BookType).includes(bookToSave!.bookType);

    return (
      bookToSave!.author.length !== 0 &&
      bookToSave!.title.length !== 0 &&
      bookToSave!.isbn.length !== 0 &&
      validLevel &&
      validBookType
    );
  }, [newBook, editBook, existingBook]);

  // handles the setState for all HTML input fields
  const bookChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Fields that should be treated as numbers
    const numericFields = new Set(["numPages"]);

    let updatedValue: Date | string | number = value;

    // Handle numeric fields
    if (numericFields.has(name)) {
      // Allow empty string for input UI, but store as 0
      setNumpages(value); // only needed for numPages input

      updatedValue = value === "" ? 0 : Math.max(Number(value), 0);
    }

    if (name === "releaseDate") {
      // Prevent future dates
      let dateValue = new Date(value);
      if (dateValue > new Date()) {
        dateValue = new Date(); // <-- just use the current date directly
      }
      updatedValue = dateValue;
    }

    // Update the correct book state
    if (existingBook) {
      setEditBook((prevBook) => ({
        ...prevBook!,
        [name]: updatedValue,
      }));
    } else {
      setNewBook((prevBook) => ({
        ...prevBook,
        [name]: updatedValue,
      }));
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
          } as BookWithRequests)
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

  useEffect(() => {
    if (existingBook) {
      setEditBook(
        (prevBook) =>
          ({
            ...prevBook,
            ["copies"]: numCopies,
          } as BookWithRequests)
      );
    } else {
      setNewBook(
        (prevBook) =>
          ({
            ...prevBook,
            ["copies"]: numCopies,
          } as Omit<Book, "id">)
      );
    }
  }, [numCopies, availableCopies, existingBook]);

  const findSimilar = (allBooks: BookWithRequests[], title: string) => {
    return (
      allBooks.filter(
        (book) =>
          book.title === title ||
          book.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(book.title.toLowerCase())
      ) || []
    );
  };
  const handleSave = async () => {
    try {
      let similarBooks = [];
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
        const booksResult = await getAllBooks({ withStats: false });
        const allBooks = booksResult?.books ?? [];
        //checks if any similar books are returned, but should also ask the user
        similarBooks = findSimilar(allBooks, newBook.title);
        if (setBookList) setBookList(similarBooks);
        if (setOriginalBook) setOriginalBook(newBook);

        if (similarBooks.length === 0) {
          // Ensure ISBN is captured even if pullISBN failed (404)
          if (isbn && !newBook.isbn.includes(isbn)) {
            newBook.isbn.push(isbn);
          }

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
      exit(similarBooks.length != 0);

      if (similarBooks.length === 0) {
        window.location.reload();
      }
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
                  exit(false);
                }}
              />
              <CommonButton
                label={existingBook ? "Save" : "Add Book"}
                onClick={requiredFields ? handleSave : undefined}
                altTextStyle="text-white"
                altStyle={`bg-dark-blue ${
                  requiredFields ? "" : "opacity-50 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
          <div className="h-[0.3px] bg-black"></div>
        </div>
        {isbn ? (
          <div>
            <label htmlFor="isbn" className="block text-lg ml-[5%] mb-2">
              ISBN Number
            </label>
            <div
              id="isbn"
              className={
                "text-black border border-medium-grey-border p-2 px-4 rounded-lg border-solid w-[90%] mx-auto h-10 font-normal flex items-center "
              }
            >
              {editBook ? editBook.isbn[0] : isbn}
            </div>
          </div>
        ) : null}
        <div className="mt-4">
          <label htmlFor="title" className="block text-lg ml-[5%] mb-2">
            Title<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={
              "text-black border border-medium-grey-border p-5 rounded-lg border-solid w-[90%] mx-auto block h-9 font-normal " +
              (newBook.title ? "bg-blue-100" : null)
            }
            onChange={bookChangeHandler}
            value={editBook ? editBook.title : newBook.title}
            required
          />
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%] break-words">
            <label htmlFor="author" className="text-lg mb-2">
              Author(s)<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              className={
                "text-black border border-medium-grey-border rounded-lg border-solid block h-10 font-normal " +
                (newBook.author ? "bg-blue-100" : null)
              }
              onChange={bookChangeHandler}
              value={editBook ? editBook.author : newBook.author}
            />
          </div>
          <div className="flex flex-col w-[50%] break-words">
            <label htmlFor="publisher" className="text-lg mb-2">
              Publisher(s)
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              className={
                "text-black border border-medium-grey-border rounded-lg border-solid block h-10 font-normal " +
                (newBook.publisher ? "bg-blue-100" : null)
              }
              onChange={bookChangeHandler}
              value={editBook ? editBook.publisher : newBook.publisher}
            />
          </div>
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%] break-words">
            <label htmlFor="releaseDate" className="text-lg mb-2">
              Release Date
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-10 font-normal"
              onChange={bookChangeHandler}
              defaultValue={
                editBook && editBook.releaseDate
                  ? new Date(editBook.releaseDate).toISOString().split("T")[0]
                  : undefined
              }
            />
          </div>
          <div className="flex flex-col w-[50%] break-words">
            <label htmlFor="pages" className="text-lg mb-2">
              No. of pages
            </label>
            <input
              type="number"
              id="numPages"
              name="numPages"
              className={
                "text-black border border-medium-grey-border rounded-lg border-solid block h-10 font-normal " +
                (newBook.numPages ? "bg-blue-100" : null)
              }
              onChange={bookChangeHandler}
              value={numPages}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-lg ml-[5%] mb-2 max-w-[75vw]"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className={`
              text-black
              border border-medium-grey-border
              p-3
              rounded-lg border-solid
              w-[90%] mx-auto block
              min-h-[150px]
              font-normal
              ${newBook.description ? "bg-blue-100" : ""}
            `}
            onChange={bookChangeHandler}
            value={editBook ? editBook.description : newBook.description}
          ></textarea>
        </div>
        <div className="flex w-[90%] mx-auto space-x-4">
          <div className="flex flex-col w-[50%] break-words">
            <label htmlFor="level" className="text-lg mb-2">
              Level<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="level"
              name="level"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-10 font-normal"
              onChange={bookChangeHandler}
              defaultValue={
                editBook && editBook.level !== null ? editBook.level : ""
              }
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
          <div className="flex flex-col w-[50%] break-words">
            <label htmlFor="bookType" className="text-lg mb-2">
              Type<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="bookType"
              name="bookType"
              className="text-black border border-medium-grey-border rounded-lg border-solid block h-10 font-normal"
              onChange={bookChangeHandler}
              defaultValue={
                editBook && editBook.bookType !== null ? editBook.bookType : ""
              }
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

        <div className="flex flex-col w-[90%] mx-auto space-x-4">
          <div className=" w-[50%] ">
            <p className="text-lg mb-2">Number of Copies</p>
            <div className="flex flex-row gap-4">
              <div
                className={`w-full h-10 flex flex-row justify-center items-center text-black  rounded-lg border border-solid font-normal text-center ${
                  isInvalidCopies ? `border-red-500` : ` border-medium-grey`
                }`}
              >
                <p>{editBook ? editBook.copies : newBook.copies}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (availableCopies > 0) {
                    setNumCopies(numCopies - 1);
                    setAvailableCopies(availableCopies - 1);
                  } else {
                    setisInvalidCopies(true);
                  }
                }}
                className="h-10 w-10 p-4 border border-dark-blue text-dark-blue rounded-lg border-solid flex flex-row justify-center items-center"
              >
                <p>-</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNumCopies(numCopies + 1);
                  setAvailableCopies(availableCopies + 1);
                  setisInvalidCopies(false);
                }}
                className="h-10 w-10 p-4 border border-dark-blue-border rounded-lg border-solid bg-dark-blue text-white flex flex-row justify-center items-center"
              >
                <div>+</div>
              </button>
            </div>
            {isInvalidCopies ? (
              <p className="text-red-500 font-normal">
                {(editBook ? editBook.copies : newBook ? newBook.copies : 0) -
                  availableCopies}{" "}
                out right now, cannot have less copies than loans
              </p>
            ) : null}
          </div>
        </div>
        <div>
          <div className="mb-4">
            <p className="block text-lg ml-[5%] mb-2">Skills</p>
            <div className="flex flex-wrap gap-x-4 gap-y-4 ml-[5%] mr-[5%] items-center">
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
        </div>
      </form>
    </div>
  );
};

export default BookForm;
