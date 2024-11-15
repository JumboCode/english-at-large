"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";


export default function Home() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  // useEffect(() => {
  //   console.log("Auth State:", { isLoaded, userId });  // Debug log

  //   if (isLoaded) {
  //     if (!userId) {
  //       console.log("No user ID, redirecting to login");  // Debug log
  //       router.replace("/login");
  //     } else {
  //       console.log("User ID found, redirecting to dashboard");  // Debug log
  //       window.location.href = "/dashboard/books";  // Force redirect
  //     }
  //   }
  // }, [userId, isLoaded, router]);

  
  // //router.push("/login");
  // if (!isLoaded) {
  //   return <div>Loading...</div>;
  // }
  window.location.href = "/dashboard/books";

  return <div></div>;
}
