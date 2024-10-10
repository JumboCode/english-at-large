"use client";
import React, {useState} from "react";
import RedSquare from "@/components/about/RedSquare"; 

const AddNewBookButton = () => {
const [showSquare, setShowSquare] = useState(false);

    const handleAddNewBook =  () => { 
            setShowSquare(true);
    };

    if (showSquare) {
        return (<RedSquare />);
    }

    return (
        <div>
          <button onClick={handleAddNewBook}>
            Add new
          </button>
        </div>
    );
}

export default AddNewBookButton; 