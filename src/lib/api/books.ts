import axios from "axios";

export async function getBooks() {
  try {
    const response = await axios.get("/api/books");
    return response.data; //JSOn
  } catch (error) {
    throw new Error("Failed to fetch books");
  }
}

export async function createBook(book: { name: string; owner: string }) {
  try {
    const response = await axios.post("/api/books", book);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create book");
  }
}

// Add other CRUD functions as needed (updateBook, deleteBook, etc.)
