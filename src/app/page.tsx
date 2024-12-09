"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/*
 * Home Page
 * ...it's the home page.
 * eventually where the database will be at, depending on design flow.
 *
 *
 */
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to /dashboard/books when the component mounts
    router.push("/dashboard/books");
  }, [router]);
  return <div></div>;
}
