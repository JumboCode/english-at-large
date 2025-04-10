"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        router.replace("/login");
      } else {
        router.replace("/dashboard/books");
      }
    }
  }, [userId, isLoaded, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return <div></div>;
}
