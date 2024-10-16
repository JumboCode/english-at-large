"use client";
import CreateBookButton from "@/components/about/CreateBookButton";
import Button from "@/components/common/button/ButtonProps";
import RedSquare from "@/components/about/RedSquare";

import React, {useState} from "react";

const About = () => {
  const [showSquare, setShowSquare] = useState(false);

  return (
    <div>
      Testing
      <CreateBookButton />

      <Button onClick={() => setShowSquare(true)} label="Add new"/>
        { showSquare ? <RedSquare /> : null } 

    </div>
  );

}

export default About; 
