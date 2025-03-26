"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function DriveTest() {
  const [image, setImages] = useState<string>("");

  const getImage = async () => {
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files?q='16Ip00DQ-FrNxqvOfyO_W71UfC2uvgeD8'+in+parents&key=${process.env.NEXT_PUBLIC_DRIVE_API_KEY}`
    );

    console.log(response.data.files[0].id);
    setImages(response.data.files[0].id);
  };

  return (
    <div>
      <p>Testing</p>
      <button onClick={getImage}>get image</button>
      <Image
        src={`https://drive.google.com/uc?id=${image ?? ""}`}
        width={256}
        height={256}
        alt="image"
      />
    </div>
  );
}
