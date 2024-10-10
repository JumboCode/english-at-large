"use client";
import React from "react";
import { styleText } from "util";

 

const AddNewBookButton = () => {
    const handleAddNewBook =  () => { 
        // return (
        //     <div style={{
        //         border: '1px solid black',
        //         padding: '20px',
        //         width: '200px',
        //         height: '100px'
        //       }}>
        //         This is a simple box
        //     </div>
        // );

        console.log("clicked!"); 
    };

    const styles = {
        square: {
            width: '50px',
            height: '50px',
            color: 'red',
        }
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

