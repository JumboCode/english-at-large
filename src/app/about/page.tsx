"use client";
import CreateBookButton from "@/components/about/CreateBookButton";
import Button from "@/components/common/button/CommonButton";
import AddNewBookForm from "@/components/AddNewBookForm";

import { DiApple } from "react-icons/di";

import React, { useState } from "react";

const About = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      Testing
      <CreateBookButton />
      <Button
        onClick={() => setShowForm(true)}
        label="Add new"
        icon={<DiApple />}
      />
      {showForm ? <AddNewBookForm /> : null}
    </div>
  );
};

export default About;
