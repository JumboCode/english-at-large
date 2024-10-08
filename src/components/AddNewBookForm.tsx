"use client";

const AddNewBookForm = () => {
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState<string | null>(null);

  return (
    <div className="bg-white text-black block text-sm font-medium leading-6 text-gray-900">
      <form className="block flex flex-col gap-y-4">
        <h1 className="font-bold text-3xl">Add new Book</h1>
        <div>
          <label htmlFor="title" className="block text-lg ">Title</label>
          <input type="text" id="title" className="border-2 border-black border-solid rounded-md"/>
          <label htmlFor="author" className="block text-lg ">Author</label>
          <input type="text" id="author" className="border-2 border-black border-solid rounded-md"/>
        </div>
        <div>
          <label htmlFor="ISBN " className="block text-lg ">ISBN Number</label>
          <input type="text" id="ISBN" className="border-2 border-black border-solid rounded-md"/>
          <select name="type" className="border-2 border-black border-solid rounded-md">
            <option value="">Select Book Type</option>
          </select>
        </div>
        <div>
          <label htmlFor="publisher" className="block text-lg ">Publisher</label>
          <input type="text" id="publisher" className="border-2 border-black border-solid rounded-md"/>
          <label htmlFor="releaseDate" className="block text-lg ">Release Date</label>
          <input type="text" id="releaseDate" className="border-2 border-black border-solid rounded-md"/>
        </div>
        <div>
          <label htmlFor="description" className="block text-lg ">Description</label>
          <textarea id="description" className="border-2 border-black border-solid rounded-md"></textarea>
        </div>
        <div>
        <select name="level" className="border-2 border-black border-solid rounded-md">
            <option value="">Select Level</option >
          </select>
        </div>

        <div>
          <p>Skills</p>
          <ul>
            <li>Grammar</li>
            <li>Vocab</li>
            <li>Reading</li>
            <li>Writing</li>
            <li>Speaking</li>
            <li>Listening</li>
            <li>Pronunciation</li>
          </ul>
        </div>
        <div>
          <button type="button" className="border-2 border-black border-solid rounded-md">Cancel</button>
          <button type="button" className="border-2 border-black border-solid rounded-md">Save</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBookForm;
