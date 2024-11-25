"use client";
import { deleteBook } from "@/lib/api/books";
import CommonButton from "./common/button/CommonButton";
import { Book } from "@prisma/client";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import BookDetail from "./details";
=======
import BookDetail from "./Details";
>>>>>>> 51bce2eaa3d89a963440803ec1ea2b6be7e2b7cb

interface RemoveModalProps {
  setShowRemoveModal: (arg0: boolean) => void;
  book: Book;
}

const RemoveModal = ({ setShowRemoveModal, book }: RemoveModalProps) => {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      await deleteBook(book.id);
      setShowRemoveModal(false);
      router.push("/dashboard/books");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex fixed backdrop-brightness-50 inset-0 justify-center items-center z-50 rounded-xl">
      <div className="bg-[#FFFFFF] rounded-md py-5 px-12">
        <h1 className="text-black text-2xl font-[family-name:var(--font-rubik)] font-semibold place-self-start">
          Remove book
        </h1>
        <p className="text-[#757575] text-sm font-[family-name:var(--font-rubik)] font-regular place-self-start pt-1.5">
          Are you sure you want to remove this book from the EAL collection?
        </p>
        <hr className="h-px my-6 bg-gray-300 border-0 w-[512px]" />
        <div className="flex">
          {/* TODO: replace with book cover image once implemented */}
          <div className="bg-gray-500 w-[146px] h-[215px]" />
          <div className="ml-7">
            <h1 className="text-black text-lg font-[family-name:var(--font-rubik)] font-semibold">
              {book.title}
            </h1>
            <p className="text-black text-sm font-[family-name:var(--font-rubik)] font-regular">
              {" "}
              by {book.author}{" "}
            </p>
            <div className="mt-5 text-md font-[family-name:var(--font-rubik)]">
              <BookDetail
                isbn={book.isbn}
                publisher={book.publisher}
                releaseDate={book.releaseDate}
<<<<<<< HEAD
=======
                numPages={book.numPages}
>>>>>>> 51bce2eaa3d89a963440803ec1ea2b6be7e2b7cb
                copies={10}
                lineSpacing="space-y-5"
                fontSize="text-sm"
              />
            </div>
          </div>
        </div>
        <hr className="h-px mt-3 bg-gray-300 border-0 w-[512px]" />
        <div className="flex place-self-end mt-6">
          <CommonButton
            label="Cancel"
            onClick={() => {
              setShowRemoveModal(false);
            }}
            altStyle="w-40 h-10 bg-white border-[#757575] mr-3"
            altTextStyle="text-black font-[family-name:var(--font-rubik)] font-semibold"
          />
          <CommonButton
            label="Remove"
            onClick={handleDelete}
            altStyle="w-40 h-10 bg-[#EC221F] border-none"
            altTextStyle="text-white font-[family-name:var(--font-rubik)] font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default RemoveModal;
