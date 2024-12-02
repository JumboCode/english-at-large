"use client";
import { deleteBook } from "@/lib/api/books";
import CommonButton from "./common/button/CommonButton";
import { Book } from "@prisma/client";
import { useRouter } from "next/navigation"
import Image from "next/image";
import BookDetail from "./Details";
import { usePopup } from "./common/message/PopupContext";
import imageToAdd from "../assets/images/harry_potter.jpg"
import { PopupTypes, PopupActions } from "./common/message/ConfirmationPopup"

interface RemoveModalProps {
  book: Book;
  setShowRemoveModal: (arg0: boolean) => void;
}

const RemoveModal = ({ book, setShowRemoveModal }: RemoveModalProps) => {
  const router = useRouter();
  const { setShowPopup } = usePopup();

  const handleDelete = async () => {
      try {
        await deleteBook(book.id);
        setShowRemoveModal(false);
        setShowPopup(PopupTypes.BOOK, PopupActions.REMOVE, true);
        router.push("/dashboard/books");

      } catch (error) {
        setShowRemoveModal(false); 
        setShowPopup(PopupTypes.BOOK, PopupActions.REMOVE, false); 
        router.push("/dashboard/books");
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
          <div className="w-[150px] h-[215px] flex justify-center items-center">
              <Image
                src={book.coverURL || imageToAdd.src}
                alt="Book Cover"
                width={150}
                height={215}
                className="w-full h-full object-fill"
              />
            </div> 
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
                numPages={book.numPages}
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