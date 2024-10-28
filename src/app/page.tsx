import SearchBar from "@/components/SearchBar";

/*
 * Home Page
 * ...it's the home page.
 * eventually where the database will be at, depending on design flow.
 *
 *
 */
export default function Home() {
  return (
    <div>
      <SearchBar />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <a
            className="flex items-center justify-center rounded h-16 w-36 bg-gray-500"
            href="dashboard/backendTest"
          >
            <p className="text-center">Click to go to test backend page</p>
          </a>
          <a
            className="flex items-center justify-center rounded h-16 w-36 bg-gray-500"
            href="login"
          >
            <p className="text-center">Click to go to login page</p>
          </a>
          <a
            className="flex items-center justify-center rounded h-16 w-36 bg-gray-500"
            href="dashboard/display"
          >
            <p className="text-center">Click to go to test display page</p>
          </a>
          {/* <AddNewBookForm /> */}
        </main>
      </div>
    </div>
  );
}
