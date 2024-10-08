"use client";

const AddNewBookForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

  return (
    <div>
            <h1>Add new Book</h1>
            <label htmlFor="title">Title</label>
            <input type = "text" id="title" />
            <label htmlFor="author">Author</label>
            <input type = "text" id="author" />
            <label htmlFor="ISBN">ISBN Number</label>
            <input type = "text" id="ISBN" />
            <select name="type">
                <option value="">Select Book Type</option>
            </select>
            <label htmlFor="description">Description</label>
            <textarea id = "description"></textarea>
            <input type = "text" id="title" />
            <select name="level">
                <option value="">Select Level</option>
            </select>
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

  );
};

export default AddNewBookForm;