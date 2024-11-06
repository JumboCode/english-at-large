"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard/books when the component mounts
    router.push("/dashboard/books");
  }, [router]);

  return <div></div>;
}
