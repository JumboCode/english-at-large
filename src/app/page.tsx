"use client";
import AddNewBookForm from "@/components/common/forms/AddNewBookForm";
import ConfirmationPopup from "@/components/common/message/ConfirmationPopup";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/*
 * Home Page
 * ...it's the home page.
 * eventually where the database will be at, depending on design flow.
 *
 *
 */
export default function Home() {
  const [bookFormShown, setBookFormShown] = useState(false);
  const [bookFormPopup, setBookFormPopup] = useState(["", false, false]); // message, success, shown?
  const router = useRouter();
  useEffect(() => {
    // Redirect to /dashboard when the component mounts
    router.push("/dashboard");
  }, [router]);
  return (
    <div>
      <SearchBar setShowBookForm={setBookFormShown} />

      {bookFormShown ? (
        <AddNewBookForm
          setShowBookForm={setBookFormShown}
          setPopup={setBookFormPopup}
        ></AddNewBookForm>
      ) : null}

      {bookFormPopup[2] ? (
        <ConfirmationPopup
          message={bookFormPopup[0]}
          success={bookFormPopup[1]}
        />
      ) : null}
    </div>
  );
}
