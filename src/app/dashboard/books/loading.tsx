"use client"; 
import loadingImage from "@/images/loading.jpg"; 
import Image from "next/image";

export default function Loading() {
    console.log("loading rendered");
    return (
      <div>
         <div className="flex items-center h-screen justify-center">
          <Image
            aria-hidden
            src={loadingImage}
            alt="loading"
            width={120}
            height={130}
            className="object-cover"
          />
        </div> 
      </div>
    ) 
  }